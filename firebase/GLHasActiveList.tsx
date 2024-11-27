import { ref, get } from "firebase/database";
import { database } from "../firebase/firebase";

export const hasActiveList = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    // Reference to the user's GeneratedLists table
    const generatedListsRef = ref(database, `GeneratedLists/${userId}`);

    // Fetch all lists for the user
    const snapshot = await get(generatedListsRef);

    if (snapshot.exists()) {
      const lists = Object.values(snapshot.val()) as Array<{ status: string }>;

      // Check if any list has `status` set to "active"
      return lists.some((list) => list.status === "active");
    } else {
      return false; // No lists found
    }
  } catch (error) {
    console.error("Error checking for active list:", error);
    return false; // Return false if an error occurs
  }
};
