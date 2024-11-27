import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

interface DeleteButtonProps {
  onDeletePress: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDeletePress }) => {
  return (
    <TouchableOpacity onPress={onDeletePress} style={styles.deleteButtonContainer}>
      <Image
        source={require("../assets/delete.png")} 
        style={styles.deleteButtonImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  deleteButtonImage: {
    width: 30, 
    height: 30, 
  },
});

export default DeleteButton;
