import { ref, get } from "firebase/database";
import { database } from "../firebase/firebase";

// Define the GeneratedList type
type GeneratedList = {
  status: string; // "active", "inactive", etc.
  new_list: string; // "Y" or "N"
  items: Array<{ item: string; status: string }>; // List of items
  generated_date: string; // Date the list was generated
};

/**
 * Fetch the latest active entry for a user in the GeneratedList table.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{ key: string; data: GeneratedList } | null>} - The latest active list or null if none exists.
 */
const fetchLatestActiveGeneratedList = async (userId: string): Promise<{ data: GeneratedList } | null> => {
  if (!userId) {
    console.error("User ID is required to fetch the active list.");
    return null;
  }

  try {
    // Reference to the user's GeneratedList table
    const generatedListsRef = ref(database, `GeneratedLists/${userId}`);

    // Fetch all lists
    const snapshot = await get(generatedListsRef);

    if (snapshot.exists()) {
      const lists = snapshot.val() as Record<string, GeneratedList>;

      // Filter for active lists
      const activeLists = Object.entries(lists).filter(
        ([, data]) => data.status === "active"
      );

      if (activeLists.length > 0) {
        console.log(activeLists);
        // Get the most recent entry (latest key)
        const [latestKey, latestData] = activeLists[activeLists.length - 1];
        console.log(latestData);
        return { data: latestData };
      }
      console.log(activeLists);
    }

    return null; // Return null if no active list found
  } catch (error) {
    console.error("Error fetching the latest active generated list:", error);
    return null;
  }
};

export default fetchLatestActiveGeneratedList;
