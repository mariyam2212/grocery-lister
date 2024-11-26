import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

export default function ShoppingCompletionScreen() {
    const router = useRouter();
    const { generatedList } = useUser();
  
    const itemsBought = generatedList.filter((item) => item.status === "N").length;
    
    const handleHomePress = () => {
      router.push("./home"); // Navigate to the home screen
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You're finished shopping!</Text>
        <Text style={styles.subTitle}>{itemsBought} Items Bought</Text>
        <Button title="Home" onPress={handleHomePress} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      color: "#374151",
      marginBottom: 16,
    },
    subTitle: {
      fontSize: 20,
      color: "#F97316", // Orange text color
      marginBottom: 32,
    },
  });
  
