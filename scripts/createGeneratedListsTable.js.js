import { database } from "../firebase/firebase.js"; // Import Firebase configuration
import { ref, set } from "firebase/database";

const createGeneratedListsTable = async () => {
  try {
    // Define an empty table structure with placeholders
    const generatedListsTable = {
      list_001: {
        user_id: "", // Placeholder for user ID
        generated_date: "", // Placeholder for list generation timestamp
        items: [], // Empty array for items
        status: "active", // Default status
        finalized_at: "", // Placeholder for finalized date
        next_purchase_date: "" // Placeholder for next purchase date
      }
    };

    // Add the empty table to Firebase Realtime Database
    await set(ref(database, "GeneratedLists"), generatedListsTable);
    console.log("GeneratedLists table created successfully!");
  } catch (error) {
    console.error("Error creating GeneratedLists table:", error);
  }
};

createGeneratedListsTable();
