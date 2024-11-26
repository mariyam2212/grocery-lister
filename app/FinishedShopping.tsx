import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";
import { useLocalSearchParams } from "expo-router";

export default function ShoppingCompletionScreen() {
    const router = useRouter();
    const { completedItems } = useLocalSearchParams();

    const handleHomePress = () => {
        router.push({
            pathname: "./home",
            params: { newList: "Y" },
          });
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You're finished shopping!</Text>
        <Text style={styles.subTitle}>{completedItems} Items Bought</Text>
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
  
