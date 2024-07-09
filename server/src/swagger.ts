import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Protected Areas Access Management API",
      version: "1.0.0",
      description: "API for managing users, passes and places",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        Pass: {
          type: "object",
          required: ["level"],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the pass",
            },
            level: {
              type: "integer",
              description: "The level of the pass",
              minimum: 1,
              maximum: 5,
            },
            created_At: {
              type: "string",
              format: "date-time",
              description: "The date when the pass was created",
            },
            updated_At: {
              type: "string",
              format: "date-time",
              description: "The date when the pass was last updated",
            },
          },
          example: {
            _id: "60d0fe4f5311236168a109ca",
            level: 3,
            created_At: "2024-06-25T10:34:02.491Z",
            updated_At: "2024-06-25T10:34:02.491Z",
          },
        },
        Place: {
          type: "object",
          required: [
            "address",
            "phone_number",
            "required_pass_level",
            "required_age_level",
          ],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the place",
            },
            address: {
              type: "string",
              description: "The address of the place",
            },
            phone_number: {
              type: "string",
              description: "The contact phone number of the place",
            },
            required_pass_level: {
              type: "integer",
              description: "The required pass level to access the place",
              minimum: 1,
              maximum: 5,
            },
            required_age_level: {
              type: "integer",
              description: "The required age level to access the place",
            },
          },
          example: {
            _id: "60d0fe4f5311236168a109cb",
            address: "123 Main St",
            phone_number: "123-456-7890",
            required_pass_level: 3,
            required_age_level: 18,
          },
        },
        User: {
          type: "object",
          required: [
            "first_name",
            "last_name",
            "age",
            "phone_number",
            "address",
            "password",
            "pass_id",
          ],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the user",
            },
            first_name: {
              type: "string",
              description: "The first name of the user",
            },
            last_name: {
              type: "string",
              description: "The last name of the user",
            },
            age: {
              type: "integer",
              description: "The age of the user",
            },
            phone_number: {
              type: "string",
              description: "The phone number of the user",
            },
            address: {
              type: "string",
              description: "The address of the user",
            },
            password: {
              type: "string",
              description: "The password of the user (hashed)",
            },
            pass_id: {
              type: "string",
              description: "The ID of the associated pass",
            },
          },
          example: {
            _id: "60d0fe4f5311236168a109cc",
            first_name: "John",
            last_name: "Doe",
            age: 30,
            phone_number: "123-456-7890",
            address: "123 Main St",
            password: "hashedpassword123",
            pass_id: "60d0fe4f5311236168a109ca",
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
