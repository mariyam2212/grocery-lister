import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Alert } from "react-native";
import SelectableItem from "../components/SelectableItem";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { database } from "../firebase/firebase";
import { ref, onValue, set } from "firebase/database"; 
import { useUser } from "../context/UserContext";
import { useLocalSearchParams } from "expo-router";
import globalStyles from "@/constants/style";

const SelectItemsScreen: React.FC = () => {
  const router = useRouter();
  const [itemsList, setItemsList] = useState<string[]>([]); // Holds the items fetched from Firebase
  const { userId, selectedItems, pastPurchaseDate, setSelectedItems } = useUser(); 
  const { editFlag } = useLocalSearchParams();
  const isEdit = editFlag === "true"; 

  useEffect(() => {
    // Fetch items from Firebase "items" table
    const itemsRef = ref(database, "items");
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedItems = Object.values(data).map((item: any) => item.name); // Extract names of items
        setItemsList(fetchedItems);
      }
    });
    if (isEdit) {
      setSelectedItems([]);
    }
    return () => unsubscribe();
  }, []);

  const toggleItemSelection = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item)); // Remove item from selection
    } else {
      setSelectedItems([...selectedItems, item]); // Add item to selection
    }
  };

  const handleAddItem = (newItem: string) => {
    if (!itemsList.includes(newItem)) {
      setItemsList([...itemsList, newItem]); // Add new item to the list
    }
    if (!selectedItems.includes(newItem)) {
      setSelectedItems([...selectedItems, newItem]); // Select the new item
    }
  };

  const handleNextPress = async () => {
    if (selectedItems.length === 0) {
      Alert.alert("Error", "Please select at least one item before proceeding.");
      return;
    }

    try {
      if (!isEdit) {
        updateGroceryItems();
        router.push({
          pathname: "./home",
          params: { newList: "Y" },
        });
      } else {
        const newItemsAddedToGeneratedList = selectedItems;
        router.push({
          pathname: "./GeneratedList",
          params: { newItemsAddedToGeneratedList },
        });
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving your selections. Please try again.");
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
    } catch (error) {
      console.error("Error updating GroceryItems:", error);
      throw error;
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>
        {isEdit ? "Add more items" : "Select some items from your last purchase"}
      </Text>
      <SearchBar onAddItem={handleAddItem} />
      <FlatList
        data={itemsList}
        keyExtractor={(item) => item}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <SelectableItem
            label={item}
            isSelected={selectedItems.includes(item)}
            onPress={() => toggleItemSelection(item)}
          />
        )}
      />
      <Button title="Next" onPress={handleNextPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SelectItemsScreen;
