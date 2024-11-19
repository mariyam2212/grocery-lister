import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListItemProps {
  index: number;
  label: string;
  onRemove: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ index, label, onRemove }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.index}>{index + 1}.</Text>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  index: {
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});

export default ListItem;
