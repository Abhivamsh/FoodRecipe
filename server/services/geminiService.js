const axios = require('axios');

/**
 * Call Gemini API to refine and intersect recipe results with enhanced context
 * @param {Array} recipes - Raw aggregated recipes from TheMealDB
 * @param {Array<string>} ingredients - User's ingredient list
 * @param {Object} context - Additional context (mood, cookingTime, dietary, skillLevel)
 * @returns {Promise<Array>} Refined array of recipes in the specified format
 */
async function refineRecipesWithGemini(recipes, ingredients, context = {}) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.warn('Gemini API key not configured. Returning enhanced fallback results.');
      return enhancedFallbackRefineRecipes(recipes, ingredients, context);
    }

    // Validate API key format
    if (!process.env.GEMINI_API_KEY.startsWith('AIza')) {
      console.warn('Gemini API key format appears invalid. Expected format: AIza...');
      return enhancedFallbackRefineRecipes(recipes, ingredients, context);
    }

    console.log('Using Gemini API to refine recipes with enhanced context...');
    const prompt = createEnhancedGeminiPrompt(recipes, ingredients, context);
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await axios.post(
      `${process.env.GEMINI_BASE_URL}?key=${process.env.GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const geminiResponse = response.data.candidates[0].content.parts[0].text;
      return parseGeminiResponse(geminiResponse);
    }

    throw new Error('Invalid response from Gemini API');
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Gemini API Error Status:', error.response.status);
      console.error('Gemini API Error Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Error calling Gemini API:', error.response.data?.error?.message || error.message);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Gemini API:', error.message);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up Gemini API request:', error.message);
    }
    
    // Fallback: return manually refined results with enhanced context
    return enhancedFallbackRefineRecipes(recipes, ingredients, context);
  }
}

/**
 * Create a prompt for Gemini to refine the recipe results
 * @param {Array} recipes - Raw recipes from TheMealDB
 * @param {Array<string>} ingredients - User's ingredients
 * @returns {string} Formatted prompt for Gemini
 */
/**
 * Create an enhanced prompt for Gemini that considers mood, time, and dietary preferences
 * @param {Array} recipes - Raw recipes from TheMealDB
 * @param {Array<string>} ingredients - User's ingredients
 * @param {Object} context - Additional context
 * @returns {string} Enhanced formatted prompt for Gemini
 */
function createEnhancedGeminiPrompt(recipes, ingredients, context) {
  const { mood, cookingTime, dietary, skillLevel } = context;
  
  const recipeList = recipes.slice(0, 20).map(recipe => 
    `{"idMeal":"${recipe.idMeal}","strMeal":"${recipe.strMeal}","strMealThumb":"${recipe.strMealThumb}","foundIngredients":${JSON.stringify(recipe.foundIngredients || [])}}`
  ).join('\n');

  let contextDescription = "Taylor is looking for recipes";
  
  if (mood) {
    const moodDescriptions = {
      comfort: "that are comforting and hearty",
      healthy: "that are healthy and nutritious", 
      quick: "that are quick and easy to prepare",
      fancy: "that are elegant and impressive",
      experimental: "that are unique and adventurous",
      nostalgic: "that are comforting and familiar"
    };
    contextDescription += ` ${moodDescriptions[mood] || ''}`;
  }
  
  if (cookingTime) {
    contextDescription += `, with about ${cookingTime === '90+' ? '90+ minutes' : cookingTime + ' minutes'} to cook`;
  }
  
  if (skillLevel) {
    contextDescription += `, suitable for ${skillLevel} cooking skill level`;
  }
  
  if (dietary && dietary.length > 0) {
    contextDescription += `, following ${dietary.join(' and ')} dietary preferences`;
    // Add explicit dietary filtering instruction
    if (dietary.includes('vegetarian')) {
      contextDescription += ' (NO MEAT, POULTRY, OR FISH)';
    }
    if (dietary.includes('non-vegetarian')) {
      contextDescription += ' (MUST INCLUDE MEAT, POULTRY, OR FISH)';
    }
    if (dietary.includes('vegan')) {
      contextDescription += ' (NO ANIMAL PRODUCTS AT ALL)';
    }
  }
  
  if (ingredients.length > 0) {
    contextDescription += `, using available ingredients: ${ingredients.join(', ')}`;
  }

  return `${contextDescription}.

Available recipes:
${recipeList}

IMPORTANT: If dietary preferences include vegetarian, EXCLUDE all recipes with meat, poultry, fish, or seafood. If non-vegetarian is selected, ONLY INCLUDE recipes with meat, poultry, fish, or seafood. If vegan, EXCLUDE all animal products including dairy and eggs.

Return a JSON array with the best 6-8 recipes that match Taylor's needs and dietary restrictions. Include estimated cooking time and mood match info. PRESERVE the original strMealThumb URLs exactly as provided:

[{"idMeal":"52772","strMeal":"Recipe Name","strMealThumb":"https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg","foundIngredients":["ingredient1"],"ingredientCount":1,"estimatedTime":30,"moodMatch":"Perfect for comfort food","perfectMatch":true}]

Focus on recipes that match the dietary restrictions, mood and time constraints. Only JSON, no explanation.`;
}

/**
 * Enhanced fallback function that considers mood, time, and dietary preferences
 * @param {Array} recipes - Raw recipes
 * @param {Array<string>} ingredients - User's ingredients  
 * @param {Object} context - Additional context
 * @returns {Array} Enhanced manually refined recipes
 */
function enhancedFallbackRefineRecipes(recipes, ingredients, context) {
  const { mood, cookingTime, dietary, skillLevel } = context;
  
  // If no recipes from TheMealDB, return some default suggestions based on context
  if (!recipes || recipes.length === 0) {
    return generateContextBasedSuggestions(context, ingredients);
  }
  
  // Sort recipes by number of matching ingredients (descending)
  let sortedRecipes = recipes
    .filter(recipe => recipe.foundIngredients && recipe.foundIngredients.length > 0)
    .sort((a, b) => (b.foundIngredients?.length || 0) - (a.foundIngredients?.length || 0));
    
  // Apply dietary filtering first
  if (dietary && dietary.length > 0) {
    sortedRecipes = filterByDietaryPreferences(sortedRecipes, dietary);
  }
    
  // Apply mood-based filtering and enhancement
  sortedRecipes = sortedRecipes.map(recipe => {
    const enhanced = {
      idMeal: recipe.idMeal,
      strMeal: recipe.strMeal,
      strMealThumb: recipe.strMealThumb,
      foundIngredients: recipe.foundIngredients || [],
      ingredientCount: recipe.foundIngredients ? recipe.foundIngredients.length : 1
    };
    
    // Add estimated time based on recipe complexity and user's time constraint
    if (cookingTime) {
      const timeNum = parseInt(cookingTime) || 30;
      enhanced.estimatedTime = Math.min(timeNum, 45); // Cap at reasonable time
    }
    
    // Add mood matching
    if (mood) {
      enhanced.moodMatch = getMoodDescription(mood, recipe.strMeal);
    }
    
    // Mark as perfect match if multiple criteria align
    enhanced.perfectMatch = (
      (recipe.foundIngredients?.length || 0) >= 2 &&
      mood &&
      cookingTime
    );
    
    return enhanced;
  });
  
  return sortedRecipes.slice(0, 8);
}

/**
 * Generate recipe suggestions based on context when no TheMealDB results
 */
function generateContextBasedSuggestions(context, ingredients) {
  const { mood, cookingTime } = context;
  
  // Default suggestions based on mood
  const suggestions = [
    {
      idMeal: "suggestion_1",
      strMeal: getContextualSuggestion(mood, cookingTime),
      strMealThumb: "https://via.placeholder.com/300x200?text=Recipe+Suggestion",
      foundIngredients: ingredients.slice(0, 2),
      ingredientCount: ingredients.length,
      estimatedTime: parseInt(cookingTime) || 30,
      moodMatch: getMoodDescription(mood),
      perfectMatch: false
    }
  ];
  
  return suggestions;
}

/**
 * Get mood description for a recipe
 */
function getMoodDescription(mood, recipeName = '') {
  const descriptions = {
    comfort: "Perfect comfort food",
    healthy: "Healthy and nutritious",
    quick: "Quick and easy",
    fancy: "Elegant dinner option", 
    experimental: "Try something new",
    nostalgic: "Comforting classic"
  };
  
  return descriptions[mood] || "Great choice";
}

/**
 * Get contextual recipe suggestion
 */
function getContextualSuggestion(mood, cookingTime) {
  if (mood === 'quick') return 'Quick Stir Fry';
  if (mood === 'comfort') return 'Hearty Soup';
  if (mood === 'healthy') return 'Fresh Salad Bowl';
  if (mood === 'fancy') return 'Gourmet Pasta';
  return 'Delicious Home Cooking';
}

function createGeminiPrompt(recipes, ingredients) {
  const recipeList = recipes.slice(0, 20).map(recipe => 
    `{"idMeal":"${recipe.idMeal}","strMeal":"${recipe.strMeal}","strMealThumb":"${recipe.strMealThumb}","foundIngredients":${JSON.stringify(recipe.foundIngredients || [])}}`
  ).join('\n');

  return `Find the best recipes from this list for someone with these ingredients: ${ingredients.join(', ')}

Recipes:
${recipeList}

Return only a JSON array with the top 8 recipes in this exact format. PRESERVE the original strMealThumb URLs:
[{"idMeal":"52772","strMeal":"Recipe Name","strMealThumb":"https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg","foundIngredients":["ingredient1"],"ingredientCount":1}]

No explanation, just the JSON array.`;
}

/**
 * Parse Gemini's response and extract the JSON array
 * @param {string} response - Raw response from Gemini
 * @returns {Array} Parsed recipe array
 */
function parseGeminiResponse(response) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      const parsedRecipes = JSON.parse(jsonString);
      
      if (Array.isArray(parsedRecipes)) {
        return parsedRecipes;
      }
    }
    
    throw new Error('No valid JSON array found in Gemini response');
  } catch (error) {
    console.error('Error parsing Gemini response:', error.message);
    console.log('Raw Gemini response:', response);
    
    // Fallback to manual parsing or return empty array
    return [];
  }
}

/**
 * Fallback function to refine recipes when Gemini is not available
 * @param {Array} recipes - Raw recipes
 * @param {Array<string>} ingredients - User's ingredients
 * @returns {Array} Manually refined recipes
 */
function fallbackRefineRecipes(recipes, ingredients) {
  // Sort recipes by number of matching ingredients (descending)
  const sortedRecipes = recipes
    .filter(recipe => recipe.foundIngredients && recipe.foundIngredients.length > 0)
    .sort((a, b) => (b.foundIngredients?.length || 0) - (a.foundIngredients?.length || 0))
    .slice(0, 10);

  return sortedRecipes.map(recipe => ({
    idMeal: recipe.idMeal,
    strMeal: recipe.strMeal,
    strMealThumb: recipe.strMealThumb,
    foundIngredients: recipe.foundIngredients || [],
    ingredientCount: recipe.foundIngredients ? recipe.foundIngredients.length : 1
  }));
}

/**
 * Filter recipes based on dietary preferences
 * @param {Array} recipes - Recipes to filter
 * @param {Array} dietary - Dietary preferences array
 * @returns {Array} Filtered recipes
 */
function filterByDietaryPreferences(recipes, dietary) {
  return recipes.filter(recipe => {
    const recipeName = recipe.strMeal.toLowerCase();
    
    for (const pref of dietary) {
      switch (pref) {
        case 'vegetarian':
          // Filter out recipes with meat, poultry, fish
          if (containsMeat(recipeName)) {
            return false;
          }
          break;
        case 'non-vegetarian':
          // Only include recipes with meat, poultry, fish
          if (!containsMeat(recipeName)) {
            return false;
          }
          break;
        case 'vegan':
          // Filter out recipes with any animal products
          if (containsAnimalProducts(recipeName)) {
            return false;
          }
          break;
        case 'gluten-free':
          // Filter out recipes with gluten-containing ingredients
          if (containsGluten(recipeName)) {
            return false;
          }
          break;
        case 'dairy-free':
          // Filter out recipes with dairy
          if (containsDairy(recipeName)) {
            return false;
          }
          break;
        // Add more dietary filters as needed
      }
    }
    return true;
  });
}

/**
 * Check if recipe contains meat (for vegetarian filtering)
 */
function containsMeat(recipeName) {
  const meatKeywords = [
    // Red meats
    'beef', 'pork', 'bacon', 'ham', 'sausage', 'lamb', 'mutton', 'venison', 
    'steak', 'ribs', 'brisket', 'carnitas', 'jerky', 'salami', 'pepperoni', 
    'prosciutto', 'chorizo', 'hot dog', 'burger', 'meatball', 'meat loaf',
    'veal', 'rabbit', 'goat',
    
    // Poultry
    'chicken', 'turkey', 'duck', 'goose', 'quail', 'wings', 'thigh', 'breast',
    'drumstick', 'nugget', 'tender', 'cutlet',
    
    // Seafood and fish
    'fish', 'salmon', 'tuna', 'cod', 'bass', 'trout', 'halibut', 'mahi', 'sole',
    'shrimp', 'lobster', 'crab', 'scallop', 'oyster', 'mussel', 'clam', 'squid',
    'octopus', 'anchovy', 'sardine', 'mackerel', 'herring', 'catfish', 'tilapia',
    'grouper', 'snapper', 'flounder', 'swordfish', 'shark', 'eel', 'crawfish',
    'calamari', 'crayfish', 'prawns', 'seafood',
    
    // Processed meats
    'deli meat', 'lunch meat', 'cold cuts', 'pastrami', 'mortadella', 'bologna',
    'bratwurst', 'kielbasa', 'andouille', 'pancetta', 'guanciale',
    
    // General meat terms
    'meat', 'protein', 'bbq', 'barbecue', 'grilled', 'roasted', 'smoked',
    'pulled pork', 'ground beef', 'minced meat', 'mince'
  ];
  
  return meatKeywords.some(keyword => recipeName.includes(keyword));
}

/**
 * Check if recipe contains animal products (for vegan filtering)
 */
function containsAnimalProducts(recipeName) {
  if (containsMeat(recipeName)) return true;
  
  const animalProductKeywords = [
    'cheese', 'milk', 'butter', 'cream', 'yogurt', 'egg', 'honey',
    'mayo', 'mayonnaise', 'custard', 'ice cream', 'gelato'
  ];
  
  return animalProductKeywords.some(keyword => recipeName.includes(keyword));
}

/**
 * Check if recipe contains gluten
 */
function containsGluten(recipeName) {
  const glutenKeywords = [
    'bread', 'pasta', 'noodle', 'wheat', 'flour', 'pizza', 'cake', 
    'cookie', 'pastry', 'pie', 'tart', 'dumpling', 'bagel'
  ];
  
  return glutenKeywords.some(keyword => recipeName.includes(keyword));
}

/**
 * Check if recipe contains dairy
 */
function containsDairy(recipeName) {
  const dairyKeywords = [
    'cheese', 'milk', 'butter', 'cream', 'yogurt', 'custard', 
    'ice cream', 'gelato', 'parmesan', 'mozzarella', 'cheddar'
  ];
  
  return dairyKeywords.some(keyword => recipeName.includes(keyword));
}

module.exports = {
  refineRecipesWithGemini,
  enhancedFallbackRefineRecipes
};