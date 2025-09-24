"use client";
import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState("chat");
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState({
    value: "IN",
    label: "India",
  });
  const [selectedLanguage, setSelectedLanguage] = useState({
    value: "EN",
    label: "English",
  });
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const router = useRouter();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (token) {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            try {
              const response = await fetch(
                "https://juristo-back.vercel.app/api/auth/validate",
                {
                  method: "GET",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (!response.ok) {
                throw new Error("Invalid or expired token");
              }
              const decoded = await response.json();
              const email = decoded.email;
              if (email) {
                await fetchUserData(email);
              } else {
                throw new Error("Email not found in token");
              }
            } catch (error) {
              console.error("Error initializing auth:", error);
              localStorage.removeItem("token");
              localStorage.removeItem("user");
            }
          }
        } else {
          router.push("/login");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [router]);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(
        `https://juristo-back.vercel.app/api/users/get/${email}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      fetchChats(data);
      setSelectedCountry(data.country);
      setSelectedLanguage(data.language);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchChats = async (userData) => {
    try {
      const response = await fetch(
        `https://juristo-back.vercel.app/api/chat/${userData._id}`
      );
      const data = await response.json();
      setChats(data.reverse());
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  return (
    <MyContext.Provider
      value={{
        user,
        setUser,
        fetchUserData,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchChats,
        selectedCountry,
        setSelectedCountry,
        selectedLanguage,
        setSelectedLanguage,
        loading,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        currentTab,
        setCurrentTab,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };
