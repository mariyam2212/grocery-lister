import { database } from "../firebase/firebase.js"; // Import Firebase configuration
import { ref, set } from "firebase/database";

const createPurchaseHistoryTable = async () => {
  try {
    // Define the empty structure for the PurchaseHistory table
    const purchaseHistoryTable = {
      purchase_id_001: {
        user_id: "", // Placeholder for user ID
        purchase_date: "", // Placeholder for timestamp
        items: [] // Empty array for purchased items
      }
    };

    // Add the empty table to the database
    await set(ref(database, "PurchaseHistory"), purchaseHistoryTable);

    console.log("PurchaseHistory table created successfully!");
  } catch (error) {
    console.error("Error creating PurchaseHistory table:", error);
  }
};

createPurchaseHistoryTable();
