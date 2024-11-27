import React, { useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useUser } from "../context/UserContext";
import globalStyles from "@/constants/style";

export default function CreateAccountScreen() {
  const router = useRouter(); // For navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useUser();

  const handleSignUpPress = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get the user ID
      setUserId(userId);
      router.push("./NewUserScreen"); // Navigate back to the Login page after account creation
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <InputField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign up" style={styles.customButton} onPress={handleSignUpPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    paddingTop: 30,
    paddingBottom: 90,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 0.4,
    fontFamily: "Quattrocento",
    marginBottom: 40,
    textAlign: "center",
    color: "#16A34A"
  },
  customButton: {
    marginTop: 60
  }
});
