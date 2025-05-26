import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create axios instance with authentication
  const authAxios = axios.create({
    baseURL: API_URL,
  });

  // Request interceptor for adding auth token
  authAxios.interceptors.request.use(
    (config) => {
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/users/login`,
        { email, password },
        config
      );

      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/users`,
        { name, email, password },
        config
      );

      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Update Profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await authAxios.put("/api/users/profile", userData);

      const updatedUserInfo = {
        ...userInfo,
        name: data.name,
        email: data.email,
      };

      setUserInfo(updatedUserInfo);
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        authAxios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
