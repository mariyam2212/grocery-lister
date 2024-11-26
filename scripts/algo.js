// Class to represent a grocery item
class GroceryItem {
    constructor(name, frequency, lastPurchaseDate) {
      this.name = name;
      this.frequency = frequency; // purchase frequency of the item
      this.lastPurchaseDate = new Date(lastPurchaseDate); // date of the last purchase
    }
  }
  
  // Function to calculate the number of days since the last purchase
  function calculateDaysSinceLastPurchase(lastPurchaseDate) {
    const today = new Date();
    const diffTime = Math.abs(today - lastPurchaseDate); // difference in milliseconds
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
  }
  
  // Function to calculate a score based on frequency and days since last purchase
  function calculateScore(frequency, daysSinceLastPurchase, alpha = -0.1) {
    // Score decreases exponentially with the days since last purchase
    return frequency * Math.exp(alpha * daysSinceLastPurchase);
  }
  
  // Function to generate the grocery list
  function generateGroceryList(items) {
    // Calculate scores for each item
    const itemsWithScores = items.map(item => {
      const daysSinceLastPurchase = calculateDaysSinceLastPurchase(item.lastPurchaseDate);
      const score = calculateScore(item.frequency, daysSinceLastPurchase);
      return {
        name: item.name,
        score: score
      };
    });
  
    console.log("Items with raw scores:", itemsWithScores);
  
    // Calculate a dynamic threshold using the median score
    const scores = itemsWithScores.map(item => item.score).sort((a, b) => a - b);
    const medianScore =
      scores.length % 2 === 0
        ? (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2
        : scores[Math.floor(scores.length / 2)];
    const threshold = medianScore * 0.8; // Select items with scores above 80% of the median
  
    console.log("Dynamic Threshold:", threshold);
  
    // Filter items based on the calculated threshold
    let filteredItems = itemsWithScores.filter(item => item.score >= threshold);
  
    // Fallback: If no items meet the threshold, select the top N items (e.g., top 3)
    const MIN_ITEMS = 3;
    if (filteredItems.length === 0) {
      filteredItems = itemsWithScores
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, MIN_ITEMS);
    }
  
    console.log("Filtered Items:", filteredItems);
  
    // Sort the filtered items by their scores in descending order
    const sortedItems = filteredItems.sort((a, b) => b.score - a.score);
  
    console.log("Sorted Items:", sortedItems);
  
    // Return the names of the items in the sorted order
    return sortedItems.map(item => item.name);
  }
  
  // Test data
  const items = [
    new GroceryItem("Milk", 10, "2023-11-15"),
    new GroceryItem("Eggs", 8, "2023-11-08"),
    new GroceryItem("Bread", 6, "2023-11-01"),
    new GroceryItem("Butter", 5, "2023-10-25"),
    new GroceryItem("Cheese", 7, "2023-10-18"),
    new GroceryItem("Yogurt", 9, "2023-10-10"),
    new GroceryItem("Chicken", 4, "2023-10-03"),
    new GroceryItem("Beef", 3, "2023-09-20"),
    new GroceryItem("Fish", 2, "2023-09-13"),
    new GroceryItem("Apples", 8, "2023-11-10"),
    new GroceryItem("Bananas", 7, "2023-11-05"),
    new GroceryItem("Carrots", 5, "2023-10-22"),
    new GroceryItem("Potatoes", 6, "2023-10-14"),
    new GroceryItem("Rice", 4, "2023-10-01"),
    new GroceryItem("Pasta", 5, "2023-09-28"),
    new GroceryItem("Cereal", 3, "2023-09-15"),
    new GroceryItem("Toilet Paper", 2, "2023-09-10"),
    new GroceryItem("Soap", 3, "2023-09-05"),
    new GroceryItem("Shampoo", 2, "2023-08-25"),
    new GroceryItem("Dish Soap", 1, "2023-08-20")
  ];
  
  // Generate and print the suggested list
  const suggestedList = generateGroceryList(items);
  console.log("Suggested Grocery List:", suggestedList);
  