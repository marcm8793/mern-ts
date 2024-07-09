import React, { useState } from "react";
import axios from "axios";
import { LoginProps, PassInfo, AxiosError, User } from "../types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SERVER_URL } from "@/lib/server";

const Login: React.FC<LoginProps> = ({
  setIsAuthenticated,
  setPassInfo,
  setCurrentUser,
}) => {
  const [loginData, setLoginData] = useState({
    first_name: "",
    last_name: "",
    password: "",
  });

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/auth/login`,
        loginData
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      setIsAuthenticated(true);

      const passResponse = await axios.get<PassInfo>(
        `${SERVER_URL}/api/passes/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPassInfo(passResponse.data);

      const userResponse = await axios.get<User>(`${SERVER_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(userResponse.data);
    } catch (error) {
      handleLoginError(error as AxiosError);
    }
  };

  const handleLoginError = (error: AxiosError) => {
    console.error("Login error:", error);
    toast({
      title: "Login Error",
      description:
        error.response?.data?.error || "An error occurred during login.",
    });
  };

  return (
    <div className="w-96 mx-auto rounded-lg border bg-card text-card-foreground shadow-sm mt-12">
      <div className="flex flex-col p-6 space-y-1">
        <h3 className="font-semibold tracking-tight text-2xl">Login</h3>
        <p className="text-sm text-muted-foreground">
          Login to access your pass
        </p>
      </div>
      <div className="p-6 pt-0 grid gap-4">
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={loginData.first_name}
              onChange={handleInputChange}
              className="bg-card text-card-foreground border border-card-foreground rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={loginData.last_name}
              onChange={handleInputChange}
              className="bg-card text-card-foreground border border-card-foreground rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleInputChange}
              className="bg-card text-card-foreground border border-card-foreground rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
