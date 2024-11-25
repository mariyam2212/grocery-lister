import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  userId: string | null,
  setUserId: (id: string | null) => void,
  selectedDate: Date | null,
  setSelectedDate: (date: Date | null) => void,
  nextPurchaseDate: Date | null;
  setNextPurchaseDate: (date: Date | null) => void,
  selectedItems: string[]; 
  setSelectedItems: (items: string[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [nextPurchaseDate, setNextPurchaseDate] = useState<Date | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); 

  return (
    <UserContext.Provider value={{ userId,
      setUserId,
      selectedDate,
      setSelectedDate,
      nextPurchaseDate,
      setNextPurchaseDate,
      selectedItems,
      setSelectedItems, }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
