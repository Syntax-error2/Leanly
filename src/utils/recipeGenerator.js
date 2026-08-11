export function generateRecipeDetails(meal) {
    const title = meal.title?.toLowerCase() || meal.name?.toLowerCase() || '';
    let ingredients = [];
    let steps = [];

    // Specific popular meals
    if (title.includes('sinigang')) {
        ingredients = ["Shrimp/Pork (500g)", "Tamarind Soup Base (1 packet)", "Water spinach (Kangkong)", "Radish (sliced)", "Eggplant", "Tomatoes (quartered)"];
        steps = [
            "Wash and prepare all vegetables and protein.",
            "Boil water in a large pot with tomatoes and onions.",
            "Add the protein and simmer until tender.",
            "Stir in the tamarind base and season with fish sauce.",
            "Add vegetables starting with radish, then eggplant, and finally kangkong.",
            "Let it cool slightly and portion into meal containers."
        ];
    } else if (title.includes('adobo')) {
        ingredients = ["Chicken/Pork (500g)", "Soy Sauce (1/2 cup)", "Vinegar (1/3 cup)", "Garlic (1 head, crushed)", "Dried Bay Leaves (3-4)", "Black Peppercorns (1 tsp)"];
        steps = [
            "Marinate the meat in soy sauce, garlic, and peppercorns for at least 30 minutes.",
            "Heat a pan and sear the meat until lightly browned on all sides.",
            "Pour in the remaining marinade, vinegar, and add bay leaves. Do not stir yet.",
            "Bring to a boil, then lower the heat and simmer until the sauce thickens and meat is tender.",
            "Allow to cool before packing into meal prep containers."
        ];
    } else if (title.includes('tapa')) {
        ingredients = ["Beef Sirloin (thinly sliced)", "Soy Sauce (1/4 cup)", "Calamansi or Lemon juice (2 tbsp)", "Garlic (minced)", "Sugar (1 tbsp)", "Black Pepper"];
        steps = [
            "Combine soy sauce, calamansi, garlic, sugar, and pepper to create the marinade.",
            "Marinate the beef slices overnight or for at least 1 hour.",
            "Heat a pan with a little oil over medium-high heat.",
            "Pan-fry the beef in batches until browned and slightly caramelized.",
            "Serve with garlic rice and egg, or pack into prep containers."
        ];
    } else if (title.includes('salad')) {
        ingredients = ["Mixed Greens (lettuce, spinach)", "Cherry Tomatoes", "Cucumber (sliced)", "Protein (chicken breast or egg)", "Vinaigrette or Dressing"];
        steps = [
            "Wash all greens and vegetables thoroughly and dry them well.",
            "Chop cucumber, halve the tomatoes, and prepare any chosen protein.",
            "Layer the greens at the bottom of your prep containers.",
            "Add the vegetables and protein on top.",
            "Keep the dressing in a separate small container to prevent the salad from getting soggy."
        ];
    } else if (title.includes('oatmeal')) {
        ingredients = ["Rolled Oats (1/2 cup per serving)", "Milk or Almond Milk (3/4 cup)", "Chia Seeds (1 tbsp)", "Honey or Maple Syrup", "Fresh Fruits (berries, banana)"];
        steps = [
            "Measure out the oats and chia seeds into your prep jars.",
            "Pour in the milk and add your sweetener of choice.",
            "Stir well to combine and ensure no dry clumps remain.",
            "Top with fresh fruits or nuts.",
            "Seal the jars and leave in the fridge overnight."
        ];
    } 
    // Generic fallback based on tags
    else if (meal.tags?.includes('Fruit')) {
        ingredients = [`Fresh ${meal.title}`, "Lemon or Lime juice (optional, to prevent browning)"];
        steps = [
            "Wash the fruit thoroughly under cold running water.",
            "Peel, core, or remove seeds if necessary.",
            "Chop into bite-sized, uniform pieces for easy snacking.",
            "Lightly toss with a squeeze of citrus juice to preserve freshness.",
            "Store in airtight containers in the fridge."
        ];
    } else if (meal.tags?.includes('Veggie')) {
        ingredients = [`${meal.title}`, "Olive oil (1 tbsp)", "Garlic (2 cloves, minced)", "Salt and black pepper to taste"];
        steps = [
            "Wash and pat dry the vegetables.",
            "Chop into even pieces for uniform cooking.",
            "Heat olive oil in a pan and sauté the minced garlic until fragrant.",
            "Toss the vegetables in the pan until cooked but still crisp (about 5-7 minutes).",
            "Let cool completely before sealing in prep containers."
        ];
    } else if (meal.tags?.includes('Protein')) {
        ingredients = [`${meal.title}`, "Olive oil or cooking spray", "Salt, pepper, and preferred herbs", "Aromatics (garlic, onion)"];
        steps = [
            "Defrost the protein safely and pat it completely dry with paper towels.",
            "Season generously on all sides with salt, pepper, and herbs.",
            "Heat a pan or preheat your oven.",
            "Cook the protein until a safe internal temperature is reached.",
            "Let the protein rest for 5-10 minutes to retain juices before slicing and packing."
        ];
    } else {
        ingredients = [`Main ingredients for ${meal.title}`, "Cooking oil or butter", "Basic seasonings (salt, pepper, garlic powder)"];
        steps = [
            "Gather and measure all required ingredients.",
            "Prepare the primary components (chop vegetables, slice meat).",
            "Cook the main ingredients using your preferred method (sauté, bake, or boil).",
            "Combine everything and season to taste.",
            "Allow the meal to cool down before dividing it into your meal prep containers."
        ];
    }

    return { ingredients, steps };
}
