const axios = require('axios');

/**
 * Fetch recipes from TheMealDB API for a single ingredient
 * @param {string} ingredient - The ingredient to search for
 * @returns {Promise<Array>} Array of recipes containing the ingredient
 */
async function fetchRecipesByIngredient(ingredient) {
  try {
    const response = await axios.get(
      `${process.env.MEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
    );
    
    if (response.data && response.data.meals) {
      return response.data.meals;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching recipes for ingredient "${ingredient}":`, error.message);
    return [];
  }
}

/**
 * Fetch recipes for multiple ingredients and aggregate results with dietary context
 * @param {Array<string>} ingredients - Array of ingredients to search for
 * @param {Object} context - Additional context including dietary preferences
 * @returns {Promise<Object>} Object containing aggregated results and metadata
 */
async function fetchRecipesForIngredients(ingredients, context = {}) {
  try {
    let searchIngredients = [...ingredients];
    
    // Add vegetarian-friendly ingredients if vegetarian is selected
    if (context.dietary && context.dietary.includes('vegetarian')) {
      const vegetarianIngredients = ['tofu', 'beans', 'lentils', 'quinoa', 'spinach', 'mushroom', 'cheese'];
      // Add some vegetarian ingredients to broaden search
      searchIngredients = [...searchIngredients, ...vegetarianIngredients.slice(0, 2)];
    }
    
    // Fetch recipes for each ingredient in parallel
    const promises = searchIngredients.map(ingredient => 
      fetchRecipesByIngredient(ingredient.trim())
    );
    
    const results = await Promise.all(promises);
    
    // Aggregate all recipes with their source ingredients
    const aggregatedRecipes = [];
    const ingredientToRecipes = {};
    
    results.forEach((recipes, index) => {
      const ingredient = searchIngredients[index].trim();
      ingredientToRecipes[ingredient] = recipes;
      
      recipes.forEach(recipe => {
        // Add ingredient info to each recipe
        const existingRecipe = aggregatedRecipes.find(r => r.idMeal === recipe.idMeal);
        if (existingRecipe) {
          existingRecipe.foundIngredients.push(ingredient);
        } else {
          aggregatedRecipes.push({
            ...recipe,
            foundIngredients: [ingredient]
          });
        }
      });
    });
    
    return {
      success: true,
      totalRecipes: aggregatedRecipes.length,
      ingredients: ingredients, // Return original ingredients
      recipes: aggregatedRecipes,
      ingredientToRecipes
    };
  } catch (error) {
    console.error('Error fetching recipes for ingredients:', error.message);
    return {
      success: false,
      error: error.message,
      ingredients,
      recipes: []
    };
  }
}

module.exports = {
  fetchRecipesByIngredient,
  fetchRecipesForIngredients
};