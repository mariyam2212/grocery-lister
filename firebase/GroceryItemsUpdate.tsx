import { ref, get, update } from "firebase/database";
import { database } from "../firebase/firebase";

type GroceryItem = {
  frequency: number;
  lastPurchaseDate: string;
};

/**
 * Updates the GroceryItems table for a user with the completed items.
 * - If the item exists, increment its frequency and update the lastPurchaseDate.
 * - If the item does not exist, add it with a frequency of 1.
 * 
 * @param userId - The ID of the user
 * @param completedItems - The list of item names that were completed/shopped
 */
export const updateGroceryItems = async (userId: string, completedItems: string[]): Promise<void> => {
  if (!userId || completedItems.length === 0) {
    console.error("Invalid input: User ID and completed items are required.");
    return;
  }

  try {
    const groceryItemsRef = ref(database, `GroceryItems/${userId}`);
    const snapshot = await get(groceryItemsRef);
    const existingItems: Record<string, GroceryItem> = snapshot.exists() ? snapshot.val() : {};

    // Prepare updates
    const updates: Record<string, GroceryItem> = {};
    completedItems.forEach((item) => {
      if (existingItems[item]) {
        // Update existing item
        updates[item] = {
          frequency: existingItems[item].frequency + 1,
          lastPurchaseDate: new Date().toDateString(), // Update purchase date
        };
      } else {
        // Add new item
        updates[item] = {
          frequency: 1,
          lastPurchaseDate: new Date().toDateString(), // Set current purchase date
        };
      }
    });

    // Apply updates to Firebase
    await update(groceryItemsRef, updates);
    console.log("Grocery items updated successfully:", updates);
  } catch (error) {
    console.error("Error updating grocery items:", error);
  }
};

export default updateGroceryItems;
