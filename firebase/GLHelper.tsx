import { database } from "../firebase/firebase";
import { ref, query, orderByKey, limitToLast, push, get } from "firebase/database";

/**
 * Utility to create or fetch the latest entry in the GeneratedLists table for a user.
 * @param userId - The ID of the user.
 * @param action - Specify "create" to create a new entry, or "fetchLatest" to fetch the latest entry.
 * @returns For "create": a database reference to the new entry.
 *          For "fetchLatest": a Promise resolving to the latest entry or null if no entries exist.
 */
export const GeneratedListHelper = async (
  userId: string,
  action: "create" | "fetchLatest"
): Promise<any> => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const generatedListsRef = ref(database, `GeneratedLists/${userId}`);

  if (action === "create") {
    // Create a new list reference
    const newListReference = push(generatedListsRef);
    console.log("New list reference created:", newListReference.key);
    return newListReference;
  } else if (action === "fetchLatest") {
    // Fetch the latest list entry
    const latestQuery = query(generatedListsRef, orderByKey(), limitToLast(1));
    const snapshot = await get(latestQuery);
    if (snapshot.exists()) {
      const [latestKey, latestData] = Object.entries(snapshot.val())[0];
      console.log("Latest list fetched:", latestKey, latestData);
      return { latestKey, latestData };
    } else {
      console.warn("No GeneratedList entry found for the user.");
      return null;
    }
  }

  throw new Error("Invalid action specified. Use 'create' or 'fetchLatest'.");
};
