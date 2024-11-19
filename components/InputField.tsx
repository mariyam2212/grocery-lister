import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface InputFieldProps extends TextInputProps {
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    fontSize: 16,
    color: '#374151',
  },
});

export default InputField;
