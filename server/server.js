require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { fetchRecipesForIngredients } = require('./services/mealdbService');
const { refineRecipesWithGemini } = require('./services/geminiService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Main recipes endpoint
app.get('/api/recipes', async (req, res) => {
  try {
    const { ingredients, mood, cookingTime, dietary, skillLevel } = req.query;
    
    // Parse parameters
    const ingredientList = ingredients ? ingredients.split(',')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0) : [];
    
    const dietaryPrefs = dietary ? dietary.split(',')
      .map(pref => pref.trim())
      .filter(pref => pref.length > 0) : [];

    // Validate that we have at least some search criteria
    if (ingredientList.length === 0 && !mood && !cookingTime && dietaryPrefs.length === 0) {
      return res.status(400).json({ 
        error: 'Please provide at least one search criteria (ingredients, mood, cooking time, or dietary preferences)',
        example: '/api/recipes?ingredients=chicken,rice&mood=comfort&cookingTime=30'
      });
    }

    console.log(`Searching for recipes with:`, {
      ingredients: ingredientList,
      mood,
      cookingTime,
      dietary: dietaryPrefs,
      skillLevel
    });

    // Step 1: Fetch recipes from TheMealDB (if ingredients provided)
    let mealdbResults = { recipes: [], success: true };
    if (ingredientList.length > 0) {
      mealdbResults = await fetchRecipesForIngredients(ingredientList, {
        mood,
        cookingTime,
        dietary: dietaryPrefs,
        skillLevel
      });
      
      if (!mealdbResults.success) {
        return res.status(500).json({
          error: 'Failed to fetch recipes from TheMealDB',
          details: mealdbResults.error
        });
      }
    }

    console.log(`Found ${mealdbResults.recipes?.length || 0} recipes from TheMealDB`);

    // Step 2: Process with enhanced Gemini API for personalized refinement
    const refinedRecipes = await refineRecipesWithGemini(
      mealdbResults.recipes || [], 
      ingredientList,
      { mood, cookingTime, dietary: dietaryPrefs, skillLevel }
    );

    console.log(`Refined to ${refinedRecipes.length} personalized recipes`);

    // Step 3: Return structured response
    res.json({
      success: true,
      searchCriteria: {
        ingredients: ingredientList,
        mood,
        cookingTime,
        dietary: dietaryPrefs,
        skillLevel
      },
      totalFound: mealdbResults.recipes?.length || 0,
      refinedCount: refinedRecipes.length,
      recipes: refinedRecipes,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/recipes endpoint:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here',
      mealdbUrl: process.env.MEALDB_BASE_URL
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍳 Recipe Finder Server is running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🥘 Recipes endpoint: http://localhost:${PORT}/api/recipes?ingredients=chicken,rice`);
});