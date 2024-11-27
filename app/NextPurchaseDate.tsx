import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";
import { database } from "../firebase/firebase";
import { ref, set, push, query, orderByKey, limitToLast, update, get } from "firebase/database";
import { GeneratedListHelper } from "../firebase/GLHelper"
import { fetchGroceryItemsForUser } from "../firebase/GroceryItemsFetch";
import globalStyles from "@/constants/style";

type GroceryItem = {
    frequency: number;
    lastPurchaseDate: string;
  };
  
  type GroceryItems = {
    [key: string]: GroceryItem; // Index signature for grocery items
  };

const NextPurchaseDateScreen: React.FC = () => {
  const router = useRouter();
  const { userId, generatedList, setGeneratedList, setNextPurchaseDate } = useUser(); 
  const [localNextDate, setLocalNextDate] = useState<Date | null>(null); 

  const handleGenerateNewList = async () => {
    if (!localNextDate) {
      Alert.alert("Error", "Please select a date before proceeding.");
      return;
    }
    setNextPurchaseDate(localNextDate.toDateString()); 
    try {
      generateNewList();
      router.push({
        pathname: "./GeneratedList",
        params: { newList: "Y" },
      });
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving your data. Please try again.");
    }
  };

  const generateNewList = async () => {
    if (!userId) {
        return;
      }
    try {
        const groceryItems = await fetchGroceryItemsForUser(userId);
        const generatedList = generateListAlgorithm(groceryItems).map((item) => ({
          item, 
          status: "N", 
        }));
        setGeneratedList(generatedList);
        try {
          const newListReference = await GeneratedListHelper(userId, "create");
          const listData = {
            user_id: userId,
            status: "active",
            new_list: "Y",
            next_purchase_date: localNextDate ? localNextDate.toDateString() : null, 
            generated_date: new Date().toDateString(),
            items: generatedList.map((entry) => ({
                item: entry.item, 
                status: entry.status, 
              })),
          };
          await set(newListReference, listData);
        } catch (error) {
          console.error("Error creating new list:", error);
          Alert.alert("Error", "Failed to create a new list.");
        }
      } catch (error) {
        console.error("Error generating list:", error);
        Alert.alert("Error", "An error occurred while generating the list.");
      }
  }

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

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>When is your next purchase planned?</Text>
      <DateInput value={localNextDate} onChange={setLocalNextDate} />
      <Button title="Generate new list" style={styles.button} onPress={handleGenerateNewList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingTop: 70,
    paddingBottom: 90,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: 300,
    letterSpacing: 0.4,
    color: "#1B1D1C",
    fontFamily: "Quattrocento",
    marginBottom: 40,
    textAlign: "center"
  },
  button: {
    width: "90%"
  }
});

export default NextPurchaseDateScreen;
