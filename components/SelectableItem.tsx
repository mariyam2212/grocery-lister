import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SelectableItemProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const SelectableItem: React.FC<SelectableItemProps> = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.selectedItem]}
      onPress={onPress}
    >
      <Text style={[styles.itemText, isSelected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: "#FEE2E2", // Light red for selected items
  },
  itemText: {
    fontSize: 14,
    color: "#374151",
  },
  selectedText: {
    color: "#B91C1C", // Dark red for selected text
  },
});

export default SelectableItem;
