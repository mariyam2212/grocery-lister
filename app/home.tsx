import React from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../components/Button";
import { useRouter } from "expo-router";

export default function GroceryListScreen() {
  const router = useRouter();
  const handleGenerateListPress = () => {
    Alert.alert("Grocery List", "A new grocery list has been generated!");
    router.push("./GeneratedList");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready for a new grocery list?</Text>
      <Button title="Generate New List" onPress={handleGenerateListPress} />
    </View>
  );
}

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
    color: "#374151", // Dark gray
    marginBottom: 24,
  },
});
