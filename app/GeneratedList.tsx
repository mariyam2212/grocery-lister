import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Alert } from "react-native";
import Button from "../components/Button";
import ListItem from "../components/ListItem"; 
import { useUser } from "../context/UserContext";
import { useRouter } from "expo-router";
import { database } from "../firebase/firebase";
import { ref, get, query, orderByKey, limitToLast, set, update } from "firebase/database";
import { useLocalSearchParams } from "expo-router";
import { GeneratedListHelper } from "../firebase/GLHelper";
import fetchLatestActiveGeneratedList from "../firebase/GeneratedListFetch";
import { updateGroceryItems } from "../firebase/GroceryItemsUpdate"

type ListData = {
  item: string;
  status: string;
};

export default function GeneratedListScreen() {
  const { userId, generatedList, setGeneratedList } = useUser();
  const [items, setItems] = useState<ListData[]>([]); 
  const [loading, setLoading] = useState(true); 
  const { newList, newItemsAddedToGeneratedList } = useLocalSearchParams();
  const [showCheckBox, setShowCheckBox] = useState<boolean>(newList === "Y" ? false : true);
  const router = useRouter();

  useEffect(() => {
    fetchGeneratedList();
  }, [userId, generatedList]);

  const fetchGeneratedList = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }
    const latestActiveList = await fetchLatestActiveGeneratedList(userId);
    if (latestActiveList) {
      setItems(latestActiveList.data.items);
      setLoading(false);
    } 
  };

  const toggleItemStatus = (item: string) => {
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.item === item ? { ...i, status: i.status === "Y" ? "N" : "Y" } : i
      )
    );
  };

  const handleAddItemsPress = () => {
    router.push({
      pathname: "../select-items",
      params: { editFlag : "true" },
    });
  };

  const handleEditList = () => {
    setShowCheckBox(false)
  };

  const handleFinishShopping = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }
    try {
      await markListAsInactive();
      const completedItems = items.filter((item) => item.status === "Y").map((item) => item.item);
      updateGroceryItems(userId, completedItems);
      router.push({
        pathname: "./FinishedShopping",
        params: { completedItems: completedItems.length },
      });
    } catch (error) {
      console.error("Error finishing shopping:", error);
      Alert.alert("Error", "An error occurred while finishing shopping.");
    }
  };

  const markListAsInactive = async () => {
    if (!userId) {
      return;
    }
    try {
      const latestList = await GeneratedListHelper(userId, "fetchLatest");
      if (latestList) {
        const { latestKey } = latestList;
        const listRef = ref(database, `GeneratedLists/${userId}/${latestKey}`);
        const fieldsToUpdate = {
          status: "inactive",
          new_list: "N",
          finalized_on: new Date().toDateString(),
        };
        await update(listRef, fieldsToUpdate);
      } 
    } catch (error) {
      console.error("Error fetching latest list:", error);
    }
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
      const newItemsAddedToGeneratedListCasted = Array.isArray(newItemsAddedToGeneratedList)
      ? newItemsAddedToGeneratedList
      : [];

      if (snapshot.exists()) {
        const [latestKey, latestData] = Object.entries(snapshot.val())[0]; 
        const updatedItems: ListData[] = [
          ...items.map((item) => ({ ...item })), 
          ...newItemsAddedToGeneratedListCasted
            .filter(
              (newItem: string) =>
                !items.some((existingItem) => existingItem.item === newItem) 
            )
            .map((newItem: string) => ({ item: newItem, status: "Y" })), 
        ];
  
        // Update the database with the updated items
        await set(ref(database, `GeneratedLists/${userId}/${latestKey}/items`), updatedItems);
  
        // Update the context as well
        setGeneratedList(updatedItems);
  
        router.push({
          pathname: "./home",
          params: { newList: "N" },
        });
      } else {
        Alert.alert("Error", "No generated list found in the database.");
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
        {!showCheckBox ? "Review your list!" : "Check off items as you shop!"}
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.item}
        renderItem={({ item, index }) => (
          <ListItem
            index={index + 1} 
            item={item.item} 
            showCheckBox={showCheckBox}
            isChecked={item.status === "Y"} 
            onCheckBoxToggle={() => toggleItemStatus(item.item)}
            onDeletePress={() => {
              setItems((prevItems) => prevItems.filter((i) => i.item !== item.item));
            }} 
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
      <Button
        title={!showCheckBox ? "Add Items" : "Edit List"}
        onPress={!showCheckBox ? handleAddItemsPress : handleEditList}
      />
      <Button
        title={!showCheckBox ? "Done Reviewing" : "Finish Shopping"}
        onPress={!showCheckBox ? handleDoneReviewingPress : handleFinishShopping}
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
