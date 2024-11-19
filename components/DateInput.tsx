import React, { useState } from "react";
import { StyleSheet, Text, View, Platform, TouchableOpacity } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface DateInputProps {
  placeholder?: string;
  value?: Date | null;
  onChange: (date: Date) => void;
}

const DateInput: React.FC<DateInputProps> = ({ placeholder = "Select Date", value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false); // Close picker
    if (selectedDate) {
      onChange(selectedDate); // Update selected date
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={styles.inputText}>{value ? value.toDateString() : placeholder}</Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginBottom: 16,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F3F4F6",
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  calendarIcon: {
    fontSize: 20,
    color: "#374151",
  },
});

export default DateInput;
