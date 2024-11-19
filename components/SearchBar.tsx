import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from "react-native";

interface SearchBarProps {
  onAddItem: (item: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddItem }) => {
  const [searchText, setSearchText] = useState("");

  const handleAddItem = () => {
    if (searchText.trim()) {
      onAddItem(searchText.trim());
      setSearchText(""); // Clear the input
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search or add an item"
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    fontSize: 16,
    color: "#374151",
  },
  addButton: {
    marginLeft: 8,
    padding: 12,
    backgroundColor: "#16A34A",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SearchBar;
