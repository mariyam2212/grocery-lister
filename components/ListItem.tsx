import React from "react";
import { StyleSheet, View, Text } from "react-native";
import CheckBox from "./Checkbox";
import DeleteButton from "./DeleteButton";

type ListItemProps = {
  index?: number; 
  item: string; 
  showCheckBox?: boolean; 
  isChecked?: boolean; 
  onCheckBoxToggle?: () => void; 
  onDeletePress: () => void; 
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
          <DeleteButton onDeletePress={onDeletePress} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F97316", 
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemIndex: {
    fontSize: 18,
    color: "#FFFFFF", 
    fontWeight: "bold",
    marginRight: 8,
  },
  itemText: {
    fontSize: 18,
    color: "#FFFFFF", 
    fontWeight: "500",
    textAlign: "left",
  },
  deleteButton: {
    fontSize: 20,
    color: "#FFFFFF", 
  },
});

export default ListItem;
