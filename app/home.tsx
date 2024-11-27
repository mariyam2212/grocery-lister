import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { database } from "../firebase/firebase";
import { ref, onValue, get } from "firebase/database";
import { useUser } from "../context/UserContext";
import { hasActiveList } from "../firebase/GLHasActiveList"
import globalStyles from "@/constants/style";

type ListItem = {
  item: string;
  status: string;
  new_list: string;
};

type GroceryItem = {
  frequency: number;
  lastPurchaseDate: string;
};

type GroceryItems = {
  [key: string]: GroceryItem; 
};

export default function GroceryListScreen() {
  const router = useRouter();
  const { userId, setGeneratedList } = useUser(); // Access context to set generated list
  const [newList, setNewList] = useState<string | null>("Y"); // Track whether a new list can be generated
  const [groceryItems, setGroceryItems] = useState<GroceryItems>({}); 
  const [generateNewListFlag, setGenerateNewListFlag] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    hasActiveList(userId).then((isActive) => {
        if (!isActive) {
          setGenerateNewListFlag(true)
        } else {
          setGenerateNewListFlag(false)
        }
    })
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const groceryItemsRef = ref(database, `GroceryItems/${userId}`);
    get(groceryItemsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setGroceryItems(snapshot.val());
        }
      })
      .catch((error) => console.error("Error fetching grocery items:", error));
  }, [userId]);

  const handleGenerateListPress = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }
    router.push({
      pathname: "./NextPurchaseDate"
    });
  };

  const handleViewListPress = () => {
    router.push({
      pathname: "./GeneratedList",
      params: { newList: "N" },
    });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{generateNewListFlag && newList === "Y" ? "Ready for a new grocery list?" : "View your list whenever you are ready to shop!"}</Text>
      {(generateNewListFlag && newList === "Y")? (
        <Button title="Generate New List" onPress={handleGenerateListPress} />
      ) : (
        <Button title="View List" onPress={handleViewListPress} />
      )}
    </View>
  );
}
