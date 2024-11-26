import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

const NewUserScreen: React.FC = () => {
  const router = useRouter();
  const { userId, setPastPurchaseDate } = useUser(); // Access setSelectedDate from context
  const [localDate, setLocalDate] = useState<Date | null>(null);

  const handleNextPress = () => {
    if (!localDate) {
      Alert.alert("Error", "Please select a date before proceeding.");
      return;
    }
    setPastPurchaseDate(localDate.toDateString()); 
    router.push("/select-items");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userId ? `Your User ID: ${userId}` : "No User ID Found"}</Text>
      <Text style={styles.title}>When did you last go shopping?</Text>
      <DateInput value={localDate} onChange={setLocalDate} />
      <Button title="Next" onPress={handleNextPress} />
    </View>
  );
};

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
    color: "#374151",
    marginBottom: 24,
  },
});

export default NewUserScreen;
