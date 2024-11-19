import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, Alert } from "react-native";
import Button from "../components/Button";
import ListItem from "../components/ListItem";
import { useRouter } from "expo-router";

const initialList = ["Milk", "Eggs", "Bread"]; // Example generated items

const GenerateListScreen: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<string[]>(initialList);

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleAddItems = () => {
    router.push("./select-items"); // Navigate back to the item selection screen
  };

  const handleDoneReviewing = () => {
    if (items.length === 0) {
      Alert.alert("Error", "Please ensure your list has at least one item.");
      return;
    }
    Alert.alert("List Saved", "Your list has been successfully saved!");
    // Proceed to the main app flow or perform an API call
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review your list!</Text>
      <FlatList
        data={items}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => (
          <ListItem
            index={index}
            label={item}
            onRemove={() => handleRemoveItem(index)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
      <Button title="Add Items" onPress={handleAddItems} style={styles.button} />
      <Button
        title="Done Reviewing"
        onPress={handleDoneReviewing}
        style={styles.button}
      />
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
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
});

export default GenerateListScreen;
