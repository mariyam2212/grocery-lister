import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import { useRouter } from "expo-router";

const NewUserScreen: React.FC = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleNextPress = () => {
    if (!selectedDate) {
      Alert.alert("Error", "Please select a date before proceeding.");
      return;
    }
    // Proceed to the main application flow
    Alert.alert("Date Selected", `You last went shopping on ${selectedDate.toDateString()}`);
    router.push("./select-items");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>When did you last go shopping?</Text>
      <DateInput value={selectedDate} onChange={setSelectedDate} />
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
