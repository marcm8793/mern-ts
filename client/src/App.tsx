import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import { PassInfo, Place, User, AxiosError } from "./types";
import { SERVER_URL } from "./lib/server";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "./components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PowerIcon } from "lucide-react";

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [accessiblePlaces, setAccessiblePlaces] = useState<Place[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInfo, setPassInfo] = useState<PassInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchCurrentUser(token);
      fetchPassInfo(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchPlaces();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${SERVER_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      }
    } catch (error) {
      handleRequestError(error as AxiosError);
    }
  };

  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${SERVER_URL}/api/places`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaces(response.data);
      }
    } catch (error) {
      handleRequestError(error as AxiosError);
    }
  };

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await axios.get<User>(`${SERVER_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
    } catch (error) {
      handleRequestError(error as AxiosError);
    }
  };

  const fetchPassInfo = async (token: string) => {
    try {
      const response = await axios.get<PassInfo>(
        `${SERVER_URL}/api/passes/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPassInfo(response.data);
    } catch (error) {
      handleRequestError(error as AxiosError);
    }
  };

  const handleUserChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    if (userId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${SERVER_URL}/api/places/accessible/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAccessiblePlaces(response.data);
      } catch (error) {
        handleRequestError(error as AxiosError);
      }
    } else {
      setAccessiblePlaces([]);
    }
  };

  const getSelectedUser = () => {
    const user = users.find((user) => user._id === selectedUser);
    return user ? `${user.first_name} ${user.last_name}` : "null";
  };

  const handleLogOff = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setPassInfo(null);
    setCurrentUser(null); // Reset current user state
    toast({
      title: "Logged off",
      description: "You have been logged off",
    });
  };

  const handleRequestError = (error: AxiosError) => {
    console.error("Request error:", error);
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        handleLogOff();
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
        });
      } else {
        toast({
          title: "Error",
          description: error.response.data?.error || "An error occurred.",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="pt-8 text-center">
      <h1 className="flex justify-center font-bold">
        Protected Areas Access Management
      </h1>
      {isAuthenticated ? (
        <div className="pt-8 space-y-4">
          <div className="text-center justify-center flex">
            <Card className="w-full max-w-sm text-center justify-center">
              <CardHeader className="bg-white text-black px-6 py-4 rounded-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Logged in as:{" "}
                    {currentUser
                      ? `${currentUser.first_name} ${currentUser.last_name}`
                      : "Loading..."}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-black hover:bg-black hover:text-white"
                    onClick={handleLogOff}
                  >
                    <PowerIcon className="h-5 w-5" />
                    <span className="sr-only">Log Off</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Your Pass</div>
                  <div>
                    {passInfo ? (
                      <ul>
                        <li key={passInfo._id}>Level: {passInfo.level}</li>
                      </ul>
                    ) : (
                      <div>No passes available</div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-white px-6 py-4 rounded-b">
                <Button
                  className="w-full bg-white text-black hover:text-white"
                  onClick={handleLogOff}
                >
                  Log Off
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-2">
            <h2>All available Places for all users</h2>
            <ul>
              {places.map((place) => (
                <li key={place._id}>{place.address}</li>
              ))}
            </ul>
          </div>
          <div className="pt-8">
            <label htmlFor="user-select" className="flex justify-center">
              Select User:
            </label>
            <select id="user-select" onChange={handleUserChange}>
              <option value="">--Select a User--</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>
          {selectedUser && (
            <div>
              <h2>
                Accessible Places for <span>{getSelectedUser()}</span>
              </h2>
              <ul>
                {accessiblePlaces.map((place) => (
                  <li key={place._id}>{place.address}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Login
          setIsAuthenticated={setIsAuthenticated}
          setPassInfo={setPassInfo}
          setCurrentUser={setCurrentUser} // Pass setCurrentUser to Login component
        />
      )}
    </div>
  );
};

export default App;
