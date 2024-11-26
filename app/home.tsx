import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { database } from "../firebase/firebase";
import { ref, onValue, get, query, orderByKey, limitToLast, update, push, set } from "firebase/database";
import { useUser } from "../context/UserContext";

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
  [key: string]: GroceryItem; // Index signature for grocery items
};

export default function GroceryListScreen() {
  const router = useRouter();
  const { userId, setGeneratedList } = useUser(); // Access context to set generated list
  const [newList, setNewList] = useState<string | null>("Y"); // Track whether a new list can be generated
  const [groceryItems, setGroceryItems] = useState<GroceryItems>({}); // Store fetched grocery items

  useEffect(() => {
    if (!userId) return;

    // Fetch GeneratedLists for the user
    const generatedListsRef = ref(database, `GeneratedLists/${userId}`);
    const unsubscribe = onValue(generatedListsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lists = Object.values(data) as ListItem[];
        const latestList = lists[lists.length - 1];
        setNewList(latestList?.new_list || "Y");
      } else {
        setNewList("Y");
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Fetch GroceryItems for the user
    const groceryItemsRef = ref(database, `GroceryItems/${userId}`);
    get(groceryItemsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setGroceryItems(snapshot.val());
        }
      })
      .catch((error) => console.error("Error fetching grocery items:", error));
  }, [userId]);

  const calculateDaysSinceLastPurchase = (lastPurchaseDate: string): number => {
    const today = new Date();
    const lastDate = new Date(lastPurchaseDate);
    if (isNaN(lastDate.getTime())) {
      throw new Error(`Invalid date format: ${lastPurchaseDate}`);
    }
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateScore = (frequency: number, daysSinceLastPurchase: number, alpha = -0.1): number => {
    return frequency * Math.exp(alpha * daysSinceLastPurchase);
  };

  const generateListAlgorithm = (items: GroceryItems): string[] => {
    const itemsWithScores = Object.entries(items).map(([name, details]) => {
      const daysSinceLastPurchase = calculateDaysSinceLastPurchase(details.lastPurchaseDate);
      const score = calculateScore(details.frequency, daysSinceLastPurchase);
      return { name, score };
    });

    const scores = itemsWithScores.map((item) => item.score).sort((a, b) => a - b);
    const medianScore =
      scores.length % 2 === 0
        ? (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2
        : scores[Math.floor(scores.length / 2)];
    const threshold = medianScore * 0.8;

    let filteredItems = itemsWithScores.filter((item) => item.score >= threshold);

    const MIN_ITEMS = 3;
    if (filteredItems.length === 0) {
      filteredItems = itemsWithScores.sort((a, b) => b.score - a.score).slice(0, MIN_ITEMS);
    }

    return filteredItems.map((item) => item.name);
  };

  const handleGenerateListPress = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    try {
      const generatedList = generateListAlgorithm(groceryItems).map((item) => ({
        item, // Item name
        status: "A", // Default status for a newly generated item
      }));
      setGeneratedList(generatedList);

      const generatedListsRef = ref(database, `GeneratedLists/${userId}`);
      const latestQuery = query(generatedListsRef, orderByKey(), limitToLast(1));
      const snapshot = await get(latestQuery);

      if (snapshot.exists()) {
        // Get the key and data of the latest entry
        const [latestKey, latestData] = Object.entries(snapshot.val())[0] as [string, Record<string, any>]; // Ensure latestData is an object
        
        const updatedListData = {
          ...latestData, 
          status: "Y", 
          new_list: "N",
          items: generatedList.map((item) => ({ item, status: "A" })), // Replace items with the new list
          generated_date: new Date().toDateString(), // Update generation date
        };
      
        await update(ref(database, `GeneratedLists/${userId}/${latestKey}`), updatedListData);
        console.log("Latest entry updated in GeneratedLists:", updatedListData);
      } else {
        // If no entry exists, create a new one
        const newListRef = push(generatedListsRef); // Generate a unique key for the list
        const listData = {
          user_id: userId,
          status: "Y", // Set status to active
          generated_date: new Date().toDateString(), // ISO format for consistency
          items: generatedList.map((item) => ({ item, status: "Y" })), // Include item details
        };
      
        await set(newListRef, listData); // Save the new list
        console.log("New entry created in GeneratedLists:", listData);
      }
    } catch (error) {
      console.error("Error generating list:", error);
      Alert.alert("Error", "An error occurred while generating the list.");
    }
    router.push({
      pathname: "./GeneratedList",
      params: { newList: "Y" },
    });
  };

  const handleViewListPress = () => {
    router.push({
      pathname: "./GeneratedList",
      params: { newList: "N" },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready for a new grocery list?</Text>
      {newList === "Y" ? (
        <Button title="Generate List" onPress={handleGenerateListPress} />
      ) : (
        <Button title="View List" onPress={handleViewListPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "#374151",
    marginBottom: 24,
  },
});
