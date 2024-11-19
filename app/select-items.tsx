import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, Alert } from "react-native";
import SelectableItem from "../components/SelectableItem";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import { useRouter } from "expo-router";

const initialItemsList = [
  "Apples",
  "Cream",
  "Bananas",
  "Strawberries",
  "Bread",
  "Oranges",
  "Butter",
  "Water",
  "Eggs",
  "Oil",
  "Almonds",
  "Cheese",
  "Cilantro",
  "Cherries",
  "Potatoes",
  "Tomatoes",
  "Onions",
];

const SelectItemsScreen: React.FC = () => {
  const router = useRouter();
  const [itemsList, setItemsList] = useState(initialItemsList);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItemSelection = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
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

  const handleNextPress = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Error", "Please select at least one item before proceeding.");
      return;
    }
    Alert.alert("Selected Items", `You have selected: ${selectedItems.join(", ")}`);
    router.push("./home"); // Navigate to the grocery list page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select some items from your last purchase.</Text>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "#374151",
    marginBottom: 16,
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SelectItemsScreen;
