import React from "react";
import { UserProvider } from "../context/UserContext"; // UserContext for global state
import { Stack } from "expo-router"; // Expo Router Stack for navigation

export default function AppWrapper() {
  return (
    <UserProvider>
      <Stack />
    </UserProvider>
  );
}
