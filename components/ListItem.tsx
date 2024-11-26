import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import CheckBox from "./Checkbox";

type ListItemProps = {
  index?: number; // Optional numbered index
  item: string; // Name of the item
  showCheckBox?: boolean; // Whether to display a checkbox
  isChecked?: boolean; // Checkbox state
  onCheckBoxToggle?: () => void; // Callback when checkbox is toggled
  onDeletePress: () => void; // Callback for delete button press
};

const ListItem: React.FC<ListItemProps> = ({
  index,
  item,
  showCheckBox = false,
  isChecked = false,
  onCheckBoxToggle,
  onDeletePress,
}) => {
  return (
    <View style={styles.listItemContainer}>
      <Text style={styles.itemIndex}>{index ? `${index}.` : "•"}</Text>
      <Text style={styles.itemText}>{item}</Text>
      <View style={styles.itemContent}>
        {showCheckBox ? (
          <CheckBox isChecked={isChecked} onToggle={onCheckBoxToggle!} />
        ) : (
          <TouchableOpacity onPress={onDeletePress}>
            <Text style={styles.deleteButton}>🗑</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F97316", // Orange background
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIndex: {
    fontSize: 18,
    color: "#FFFFFF", // White text
    fontWeight: "bold",
    marginRight: 8,
  },
  itemText: {
    fontSize: 18,
    color: "#FFFFFF", // White text
    fontWeight: "500",
    textAlign: "left",
  },
  deleteButton: {
    fontSize: 20,
    color: "#FFFFFF", // White text
  },
});

export default ListItem;
