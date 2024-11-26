import React, { createContext, useContext, useState, ReactNode } from "react";

type GeneratedListItem = {
  item: string; 
  status: string; 
};

interface UserContextType {
  userId: string | null,
  setUserId: (id: string | null) => void,
  pastPurchaseDate: string | null,
  setPastPurchaseDate: (id: string | null) => void,
  nextPurchaseDate: string | null,
  setNextPurchaseDate: (id: string | null) => void,
  selectedItems: string[]; 
  setSelectedItems: (items: string[]) => void;
  generatedList: GeneratedListItem[]; 
  setGeneratedList: (list: GeneratedListItem[]) => void; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [pastPurchaseDate, setPastPurchaseDate] = useState<string | null>(null);
  const [nextPurchaseDate, setNextPurchaseDate] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); 
  const [generatedList, setGeneratedList] = useState<GeneratedListItem[]>([]);

  return (
    <UserContext.Provider value={{ userId,
      setUserId,
      pastPurchaseDate,
      setPastPurchaseDate,
      nextPurchaseDate,
      setNextPurchaseDate,
      selectedItems,
      setSelectedItems,
      generatedList,
      setGeneratedList }}>
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
