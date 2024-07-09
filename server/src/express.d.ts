import { IUser } from "./models/user";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: IUser["_id"] | string;
      };
    }
  }
}
