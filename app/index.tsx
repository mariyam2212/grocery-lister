import React, { useState } from "react";
import { StyleSheet, View, Alert, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../context/UserContext";

export default function LoginScreen() {
  const router = useRouter(); // For navigation
  const { setUserId } = useUser(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginPress = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = userCredential.user.uid; // Retrieve user ID from Firebase
      setUserId(userId); 

      // Check if the user is new or returning
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

      if (isNewUser) {
        router.push("./purchase-date-nu"); 
      } else {
        router.push("./home"); 
      }
      router.push("./home"); // Navigate to the Grocery List page after successful login
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <TouchableOpacity onPress={() => Alert.alert("Reset Password")}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>
      <Button title="Login" onPress={handleLoginPress} />
      <TouchableOpacity onPress={() => router.push("./create-account")}>
        <Text style={styles.createAccount}>Create new account</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#16A34A", // Green text color
    marginBottom: 32,
  },
  forgotPassword: {
    color: "#16A34A",
    fontSize: 14,
    marginVertical: 8,
    alignSelf: "flex-end",
  },
  createAccount: {
    color: "#374151",
    fontSize: 14,
    marginTop: 16,
  },
});
