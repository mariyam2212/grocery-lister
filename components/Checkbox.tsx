import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

export type CheckBoxProps = {
  isChecked: boolean; // State of the checkbox
  onToggle: () => void; // Callback for checkbox toggle
};

const CheckBox: React.FC<CheckBoxProps> = ({ isChecked, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <View style={[styles.box, isChecked && styles.checkedBox]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#16A34A", // Green border
    backgroundColor: "transparent",
  },
  checkedBox: {
    backgroundColor: "white", // Green fill when checked
  },
});

export default CheckBox;
