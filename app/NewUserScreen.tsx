import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";
import globalStyles from "@/constants/style";

const NewUserScreen: React.FC = () => {
  const router = useRouter();
  const { userId, setPastPurchaseDate } = useUser(); 
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
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>When did you last go shopping?</Text>
      <DateInput value={localDate} onChange={setLocalDate} />
      <Button title="Next" style={styles.button} onPress={handleNextPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "90%"
  }
});

export default NewUserScreen;
