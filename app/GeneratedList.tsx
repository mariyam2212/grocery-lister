import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Alert } from "react-native";
import Button from "../components/Button";
import ListItem from "../components/ListItem"; 
import { useUser } from "../context/UserContext";
import { useRouter } from "expo-router";
import { database } from "../firebase/firebase";
import { ref, get, query, orderByKey, limitToLast, set } from "firebase/database";
import { useLocalSearchParams } from "expo-router";

type ListData = {
  item: string;
  status: string;
};

export default function GeneratedListScreen() {
  const { userId, generatedList, setGeneratedList } = useUser();
  const [items, setItems] = useState<ListData[]>([]); 
  const [loading, setLoading] = useState(true); 
  const { newList } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchGeneratedList = async () => {
      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        return;
      }

      // If list exists in context, use it
      if (generatedList && generatedList) {
        setItems(generatedList);
        setLoading(false);
        return;
      }

      // Otherwise, fetch from Firebase
      try {
        const generatedListsRef = ref(database, `GeneratedLists/${userId}`);
        const latestQuery = query(generatedListsRef, orderByKey(), limitToLast(1));
        const snapshot = await get(latestQuery);

        if (snapshot.exists()) {
          const data = Object.values(snapshot.val())[0] as {
            items: ListData[];
          };
          setItems(data.items || []);
        } else {
          Alert.alert("No Generated List Found", "Please generate a list first.");
        }
      } catch (error) {
        console.error("Error fetching GeneratedList:", error);
        Alert.alert("Error", "An error occurred while fetching the generated list.");
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratedList();
  }, [userId, generatedList]);

  const toggleItemStatus = (item: string) => {
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.item === item ? { ...i, status: i.status === "Y" ? "N" : "Y" } : i
      )
    );
  };

  const handleAddItemsPress = () => {
    router.push("./select-items");
  };

  const handleEditList = () => {
    Alert.alert("Edit List", "Feature under construction!");
  };

  const handleFinishShopping = () => {
    const completedItems = items.filter((item) => item.status === "Y").length;
    router.push({
      pathname: "./FinishedShopping",
      params: { completedItems },
    });
  };

  const handleDoneReviewingPress = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    try {
      const generatedListsRef = ref(database, `GeneratedLists/${userId}`);
      const latestQuery = query(generatedListsRef, orderByKey(), limitToLast(1));
      const snapshot = await get(latestQuery);

      if (snapshot.exists()) {
        const [latestKey] = Object.entries(snapshot.val())[0];
        await set(ref(database, `GeneratedLists/${userId}/${latestKey}/items`), items);
        Alert.alert("Success", "List updated successfully!");
      }
    } catch (error) {
      console.error("Error saving list:", error);
      Alert.alert("Error", "An error occurred while saving the list.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {newList === "Y" ? "Review your list!" : "Check off items as you shop!"}
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.item}
        renderItem={({ item, index }) => (
          <ListItem
            index={index + 1} // Show the item number
            item={item.item} // Name of the item
            showCheckBox={newList === "N"} // Show checkbox for shopping phase
            isChecked={item.status === "Y"} // Checkbox is checked if status is "Y"
            onCheckBoxToggle={() => toggleItemStatus(item.item)} // Handle checkbox toggle
            onDeletePress={() => {
              setItems((prevItems) => prevItems.filter((i) => i.item !== item.item));
            }} // Handle item deletion
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
      <Button
        title={newList === "Y" ? "Add Items" : "Edit List"}
        onPress={newList === "Y" ? handleAddItemsPress : handleEditList}
      />
      <Button
        title={newList === "Y" ? "Done Reviewing" : "Finish Shopping"}
        onPress={newList === "Y" ? handleDoneReviewingPress : handleFinishShopping}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "#374151",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
});
