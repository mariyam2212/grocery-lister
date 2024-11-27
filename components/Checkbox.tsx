import React from "react";
import { TouchableOpacity, View, StyleSheet, Image } from "react-native";

export type CheckBoxProps = {
  isChecked: boolean; 
  onToggle: () => void; 
};

const CheckBox: React.FC<CheckBoxProps> = ({ isChecked, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
    <View style={[styles.box, isChecked && styles.checkedBox]}>
      {isChecked && (
        <Image
          source={require("../assets/checkmark.png")} 
          style={styles.checkmark}
        />
      )}
    </View>
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
    borderColor: "#FFFFFF", 
    backgroundColor: "#FFFFFF", 
  },
  checkedBox: {
    borderColor: "#16A34A",
    backgroundColor: "#16A34A", 
  },
  checkmark: {
    width: 17, 
    height: 13,
    tintColor: "#FFFFFF",
  },
});

export default CheckBox;
