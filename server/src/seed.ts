import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./config";
import { User } from "./models/user";
import { Pass } from "./models/pass";
import { Place } from "./models/place";
import dbData from "./database.json";

const seedDB = async (mongoURI: string, dbName: string) => {
  await mongoose.connect(mongoURI, {
    authSource: "admin",
    dbName: dbName,
  });

  console.log(`Connected to the ${dbName} database`);

  await User.deleteMany({});
  await Pass.deleteMany({});
  await Place.deleteMany({});

  const userPromises = dbData.users.map(async (userData) => {
    const passLevel = Math.floor(Math.random() * 5) + 1;
    const pass = new Pass({ level: passLevel });
    await pass.save();

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      first_name: userData.first_name,
      last_name: userData.last_name,
      age: userData.age,
      phone_number: userData.phone_number,
      address: userData.address,
      password: hashedPassword,
      pass_id: pass._id,
    });

    await user.save();
  });

  await Promise.all(userPromises);

  const placePromises = dbData.places.map((placeData) => {
    const place = new Place({
      address: placeData.address,
      phone_number: placeData.phone_number,
      required_pass_level: placeData.required_pass_level,
      required_age_level: placeData.required_age_level,
    });

    return place.save();
  });

  await Promise.all(placePromises);

  console.log(`Database ${dbName} seeded successfully`);
  await mongoose.connection.close();
};

const seedDatabases = async () => {
  try {
    // Seed the development database
    await seedDB(config.mongoURI, "PassMgtDB-DEV");

    // Seed the test database
    if (config.mongoURITest) {
      await seedDB(config.mongoURITest, "PassMgtDB-TEST");
    }

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding the databases", error);
    process.exit(1);
  }
};

seedDatabases();
