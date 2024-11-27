import React, { useState } from "react";
import { StyleSheet, View, Alert, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../context/UserContext";
import globalStyles from "@/constants/style";

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
        router.push({
          pathname: "./home"
        });
      }
      router.push("./home"); // Navigate to the Grocery List page after successful login
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
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
  forgotPassword: {
    color: "#16A34A",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 230,
  },
  createAccount: {
    color: "#374151",
    fontSize: 14,
    margin: 20,
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
});
