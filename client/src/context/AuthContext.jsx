import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/config";

export const AuthContext = createContext();

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create axios instance with authentication and retry logic
  const authAxios = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 seconds timeout
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

  // Response interceptor for handling errors
  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If the error is a network error and we haven't retried yet
      if (error.message === "Network Error" && !originalRequest._retry) {
        originalRequest._retry = 0;

        // Implement exponential backoff
        const retryRequest = async () => {
          try {
            originalRequest._retry++;
            await wait(RETRY_DELAY * originalRequest._retry);
            return await axios(originalRequest);
          } catch (retryError) {
            if (originalRequest._retry < MAX_RETRIES) {
              return retryRequest();
            }
            throw retryError;
          }
        };

        return retryRequest();
      }

      return Promise.reject(error);
    }
  );

  // Login with retry logic
  const login = async (email, password, retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 seconds timeout
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
      // Retry on network errors
      if (error.message === "Network Error" && retryCount < MAX_RETRIES) {
        setError(`Connection failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        await wait(RETRY_DELAY * (retryCount + 1));
        return login(email, password, retryCount + 1);
      }

      setError(
        error.response?.data?.message || 
        error.message || 
        'An error occurred. Please try again.'
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
