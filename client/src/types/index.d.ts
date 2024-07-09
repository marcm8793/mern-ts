import { JwtPayload } from "jwt-decode";

export interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setPassInfo: (passInfo: PassInfo | null) => void;
  setCurrentUser: (user: User | null) => void;
}

export interface DecodedToken extends JwtPayload {
  userId: string;
}

export interface PassInfo {
  _id: string;
  level: number;
  created_At: Date;
  updated_At?: Date;
}

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  age: number;
  phone_number: string;
  address: string;
  pass_id: string;
}

export interface Place {
  _id: string;
  address: string;
  phone_number: string;
  required_pass_level: number;
  required_age_level: number;
}

export interface AxiosError {
  response?: {
    status: number;
    data?: {
      error?: string;
    };
  };
  message: string;
}
