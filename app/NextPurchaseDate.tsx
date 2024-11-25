import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

const NextPurchaseDateScreen: React.FC = () => {
  const router = useRouter();
  const { userId, selectedDate, setNextPurchaseDate } = useUser(); // Access `setNextPurchaseDate` from context
  const [localNextDate, setLocalNextDate] = useState<Date | null>(null); // Local state for date selection

  const handleNextPress = () => {
    if (!localNextDate) {
      Alert.alert("Error", "Please select a date before proceeding.");
      return;
    }
    setNextPurchaseDate(localNextDate); // Save the next purchase date to the global context
    Alert.alert("Next Past Date ", ` ${selectedDate}`);
    Alert.alert("Next Past Date ", ` ${selectedDate}`);
    Alert.alert("Next Purchase Date Saved", `Your next purchase is planned for ${localNextDate.toDateString()}`);
    router.push("/home"); // Navigate to the home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userId ? `Your User ID: ${userId}` : "No User ID Found"}</Text>
      <Text style={styles.title}>When is your next purchase planned?</Text>
      <DateInput value={localNextDate} onChange={setLocalNextDate} />
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

export default NextPurchaseDateScreen;
