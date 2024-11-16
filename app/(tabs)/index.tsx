import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

export default function LoginScreen() {
  // Handlers for button actions
  const handleLoginPress = () => {
    Alert.alert('Login Pressed', 'You clicked the Login button.');
  };

  const handleForgotPasswordPress = () => {
    Alert.alert('Forgot Password', 'You clicked Forgot your password.');
  };

  const handleCreateAccountPress = () => {
    Alert.alert('Create Account', 'You clicked Create new account.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#9CA3AF"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity onPress={handleForgotPasswordPress}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCreateAccountPress}>
        <Text style={styles.createAccount}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    fontSize: 16,
    color: '#374151',
  },
  forgotPassword: {
    color: '#16A34A',
    fontSize: 14,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  loginButton: {
    marginTop: 24,
    width: '100%',
    padding: 16,
    backgroundColor: '#16A34A',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccount: {
    color: '#374151',
    fontSize: 14,
    marginTop: 16,
  },
});
