import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import globalStyles from "@/constants/style";
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
        <Text style={globalStyles.title}>You're finished shopping!</Text>
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
      padding: 20,
      paddingTop: 30,
      paddingBottom: 90,
      backgroundColor: "#FFFFFF",
    },
    subTitle: {
      fontSize: 22,
      color: "#F97316", 
      marginBottom: 35,
      marginTop: -25,
      fontFamily: "Quattrocento",
    },
  });
  
