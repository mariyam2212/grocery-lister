import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";
import { database } from "../firebase/firebase";
import { ref, set, push } from "firebase/database";

const NextPurchaseDateScreen: React.FC = () => {
  const router = useRouter();
  const { userId, pastPurchaseDate, selectedItems, setNextPurchaseDate } = useUser(); // Access `setNextPurchaseDate` from context
  const [localNextDate, setLocalNextDate] = useState<Date | null>(null); // Local state for date selection

  const updateGeneratedLists = async () => {
    try {
      const generatedListRef = ref(database, `GeneratedLists/${userId}`);
      const newListRef = push(generatedListRef);

      const listData = {
        user_id: userId,
        status: "Y",
        new_list: "Y",
        next_purchase_date: localNextDate ? localNextDate.toDateString() : null, // Store as ISO string for consistency
      };

      await set(newListRef, listData);
      console.log("Generated list added successfully.");
    } catch (error) {
      console.error("Error updating GeneratedLists:", error);
      throw error;
    }
  };

  const updateGroceryItems = async () => {
    try {
      const groceryItemsRef = ref(database, `GroceryItems/${userId}`);
  
      // Define the type for each grocery item entry
      type GroceryItem = {
        frequency: number;
        lastPurchaseDate: string;
      };
  
      // Use reduce with an explicitly typed accumulator
      const updates = selectedItems.reduce<Record<string, GroceryItem>>((acc, item) => {
        acc[item] = {
          frequency: (acc[item]?.frequency || 0) + 1, // Increment frequency
          lastPurchaseDate: pastPurchaseDate || new Date().toDateString(), // Use pastPurchaseDate or current date
        };
        return acc;
      }, {}); // Initialize the accumulator as an empty object of type Record<string, GroceryItem>
  
      // Update the `GroceryItems` table
      await set(groceryItemsRef, updates);
      console.log("Grocery items updated successfully.");
    } catch (error) {
      console.error("Error updating GroceryItems:", error);
      throw error;
    }
  };
  

  const handleNextPress = async () => {
    if (!localNextDate) {
      Alert.alert("Error", "Please select a date before proceeding.");
      return;
    }

    setNextPurchaseDate(localNextDate.toDateString()); // Save the next purchase date to the global context

    try {
      // Update Firebase tables
      await updateGeneratedLists();
      await updateGroceryItems();

      Alert.alert("Success", `Your next purchase is planned for ${localNextDate.toDateString()}`);
      router.push("/home"); // Navigate to the home screen
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving your data. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userId ? `Your User ID: ${userId}` : "No User ID Found"}</Text>
      <Text style={styles.title}>When is your next purchase planned?</Text>
      <DateInput value={localNextDate} onChange={setLocalNextDate} />
      <Button title="Next" onPress={handleNextPress} />
    </View>
  );
};

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

export default NextPurchaseDateScreen;
