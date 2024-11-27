import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  onAddItem: (item: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddItem }) => {
  const [searchText, setSearchText] = useState("");

  const handleAddItem = () => {
    if (searchText.trim()) {
      onAddItem(searchText.trim());
      setSearchText(""); 
    }
  };

  return (
    <View style={styles.container}>
      {/* Magnifying glass icon */}
      <Ionicons name="search" size={24} color="#6B7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search or add an item"
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Ionicons name="add" size={24} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12, 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  icon: {
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 16,
    color: "#374151",
  },
  addButton: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#F9FAFB",
    marginLeft: 8,
  },
});

export default SearchBar;
