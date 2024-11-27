import { database } from "../firebase/firebase"; // Import your Firebase configuration
import { ref, get } from "firebase/database";

type GroceryItemDetails = {
  frequency: number;
  lastPurchaseDate: string;
};

type GroceryItems = Record<string, GroceryItemDetails>;

export const fetchGroceryItemsForUser = async (userId: string): Promise<GroceryItems> => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch grocery items.");
    }

    const groceryItemsRef = ref(database, `GroceryItems/${userId}`);
    const snapshot = await get(groceryItemsRef);

    if (!snapshot.exists()) {
      console.log("No grocery items found for the user.");
      return {};
    }
    const groceryItems = snapshot.val() as GroceryItems;
    console.log("fetched grocery items: ", groceryItems);
    return groceryItems; // Return the fetched items as an object
  } catch (error) {
    console.error("Error fetching grocery items:", error);
    throw error; // Propagate the error
  }
};
