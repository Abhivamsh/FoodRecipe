import React, { useState } from 'react';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState(
    JSON.parse(localStorage.getItem('favoriteRecipes') || '[]')
  );
  
  // New state for enhanced features
  const [mood, setMood] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [dietaryPrefs, setDietaryPrefs] = useState([]);
  const [skillLevel, setSkillLevel] = useState('');

  // Mood options
  const moodOptions = [
    { value: 'comfort', label: '🏠 Comfort Food', description: 'Warm, hearty, and satisfying' },
    { value: 'healthy', label: '🥗 Healthy & Fresh', description: 'Light, nutritious, energizing' },
    { value: 'quick', label: '⚡ Quick Snack', description: 'Fast and easy to prepare' },
    { value: 'fancy', label: '🍽️ Fancy Dinner', description: 'Special occasion, impressive' },
    { value: 'experimental', label: '🧪 Try Something New', description: 'Adventure in flavors' },
    { value: 'nostalgic', label: '❤️ Nostalgic', description: 'Reminds you of home' }
  ];

  // Time options
  const timeOptions = [
    { value: '15', label: '⏱️ 15 minutes', description: 'Super quick' },
    { value: '30', label: '🕐 30 minutes', description: 'Reasonable time' },
    { value: '60', label: '🕑 1 hour', description: 'Take your time' },
    { value: '90+', label: '⏰ 90+ minutes', description: 'Weekend project' }
  ];

  // Dietary preferences
  const dietaryOptions = [
    { value: 'vegetarian', label: '🌱 Vegetarian' },
    { value: 'vegan', label: '🥬 Vegan' },
    { value: 'gluten-free', label: '🌾 Gluten-Free' },
    { value: 'low-carb', label: '🥩 Low-Carb' },
    { value: 'dairy-free', label: '🥛 Dairy-Free' },
    { value: 'keto', label: '🥑 Keto' }
  ];

  // Skill levels
  const skillOptions = [
    { value: 'beginner', label: '👶 Beginner', description: 'Simple and straightforward' },
    { value: 'intermediate', label: '👨‍🍳 Intermediate', description: 'Some cooking experience' },
    { value: 'advanced', label: '🔥 Advanced', description: 'Bring on the challenge!' }
  ];

  // Handle image loading errors
  const handleImageError = (e) => {
    // Set a fallback image when the original fails to load
    e.target.src = `https://via.placeholder.com/300x200/667eea/white?text=${encodeURIComponent('Recipe Image')}`;
    e.target.onerror = null; // Prevent infinite loop
  };

  // Favorites functionality
  const toggleFavorite = (recipe) => {
    const newFavorites = favoriteRecipes.find(fav => fav.idMeal === recipe.idMeal)
      ? favoriteRecipes.filter(fav => fav.idMeal !== recipe.idMeal)
      : [...favoriteRecipes, recipe];
    
    setFavoriteRecipes(newFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
  };

  const isFavorite = (recipeId) => {
    return favoriteRecipes.some(fav => fav.idMeal === recipeId);
  };

  // Add dietary preference
  const toggleDietaryPref = (pref) => {
    setDietaryPrefs(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  // Quick preset scenarios
  const applyPreset = (preset) => {
    switch(preset) {
      case 'busy-weeknight':
        setMood('quick');
        setCookingTime('30');
        setSkillLevel('beginner');
        break;
      case 'weekend-cooking':
        setMood('experimental');
        setCookingTime('90+');
        setSkillLevel('intermediate');
        break;
      case 'date-night':
        setMood('fancy');
        setCookingTime('60');
        setSkillLevel('intermediate');
        break;
      case 'comfort-evening':
        setMood('comfort');
        setCookingTime('60');
        setSkillLevel('beginner');
        break;
      case 'healthy-kick':
        setMood('healthy');
        setCookingTime('30');
        setDietaryPrefs(['vegetarian']);
        break;
      default:
        break;
    }
  };

  // Add ingredient to the list
  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, currentIngredient.trim().toLowerCase()]);
      setCurrentIngredient('');
    }
  };

  // Remove ingredient from the list
  const removeIngredient = (ingredientToRemove) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  // Handle Enter key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  // Search for recipes
  const searchRecipes = async () => {
    if (ingredients.length === 0 && !mood && !cookingTime) {
      setError('Please add at least one ingredient or select your mood/preferences');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (ingredients.length > 0) {
        params.append('ingredients', ingredients.join(','));
      }
      if (mood) params.append('mood', mood);
      if (cookingTime) params.append('cookingTime', cookingTime);
      if (dietaryPrefs.length > 0) params.append('dietary', dietaryPrefs.join(','));
      if (skillLevel) params.append('skillLevel', skillLevel);

      const response = await fetch(
        `http://localhost:5000/api/recipes?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Received recipes:', data.recipes); // Debug log
        // Log image URLs for debugging
        data.recipes.forEach(recipe => {
          console.log(`Recipe: ${recipe.strMeal}, Image: ${recipe.strMealThumb}`);
        });
        setRecipes(data.recipes);
        setSearchPerformed(true);
      } else {
        setError(data.error || 'Failed to fetch recipes');
      }
    } catch (err) {
      setError('Error connecting to server. Make sure the backend is running on port 5000.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen">
      <header className="app-header text-center py-8">
        <h1 className="text-6xl font-bold text-white shadow-lg">🍳 Recipe Finder for Taylor</h1>
        <p className="subtitle text-white text-xl mt-4">Find delicious recipes based on your available ingredients</p>
      </header>

      <main className="main-content">
        {/* Favorites Section */}
        {favoriteRecipes.length > 0 && (
          <div className="favorites-section">
            <h2>Your Favorite Recipes ❤️</h2>
            <div className="favorites-grid">
              {favoriteRecipes.slice(0, 4).map((recipe) => (
                <div key={recipe.idMeal} className="favorite-card">
                  <img 
                    src={recipe.strMealThumb || `https://via.placeholder.com/300x200/667eea/white?text=${encodeURIComponent('Recipe Image')}`} 
                    alt={recipe.strMeal}
                    onError={handleImageError}
                    crossOrigin="anonymous"
                  />
                  <div className="favorite-info">
                    <h4>{recipe.strMeal}</h4>
                    <a
                      href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quick-link"
                    >
                      Quick Cook →
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {favoriteRecipes.length > 4 && (
              <p className="favorites-count">+{favoriteRecipes.length - 4} more favorites</p>
            )}
          </div>
        )}

        {/* Quick Scenario Presets */}
        <div className="presets-section">
          <h2>What's the cooking situation today?</h2>
          <div className="preset-buttons">
            <button onClick={() => applyPreset('busy-weeknight')} className="preset-btn">
              🏃‍♂️ Busy Weeknight
            </button>
            <button onClick={() => applyPreset('weekend-cooking')} className="preset-btn">
              🏠 Weekend Cooking
            </button>
            <button onClick={() => applyPreset('date-night')} className="preset-btn">
              💕 Date Night
            </button>
            <button onClick={() => applyPreset('comfort-evening')} className="preset-btn">
              🛋️ Comfort Evening
            </button>
            <button onClick={() => applyPreset('healthy-kick')} className="preset-btn">
              💪 Healthy Kick
            </button>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="search-section">
          {/* Mood Selection */}
          <div className="filter-group">
            <label htmlFor="mood-select" className="block text-sm font-medium text-gray-700 mb-2">
              What's your cooking mood? 🍳
            </label>
            <select
              id="mood-select"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition duration-200 hover:border-gray-400"
            >
              <option value="">Select your mood...</option>
              {moodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>

          {/* Time Selection */}
          <div className="filter-group">
            <label htmlFor="time-select" className="block text-sm font-medium text-gray-700 mb-2">
              How much time do you have? ⏰
            </label>
            <select
              id="time-select"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition duration-200 hover:border-gray-400"
            >
              <option value="">Select cooking time...</option>
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Level */}
          <div className="filter-group">
            <label htmlFor="skill-select" className="block text-sm font-medium text-gray-700 mb-2">
              What's your cooking skill level? 👨‍🍳
            </label>
            <select
              id="skill-select"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition duration-200 hover:border-gray-400"
            >
              <option value="">Select skill level...</option>
              {skillOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>

          {/* Dietary Preferences */}
          <div className="filter-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Any dietary preferences? 🥗
            </label>
            <div className="space-y-2">
              {dietaryOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dietaryPrefs.includes(option.value)}
                    onChange={() => toggleDietaryPref(option.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-gray-700 font-medium">{option.label}</span>
                </label>
              ))}
            </div>
            {dietaryPrefs.includes('vegetarian') && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                ✅ <strong>Vegetarian selected:</strong> All recipes with meat, poultry, fish, and seafood will be filtered out
              </div>
            )}
            {dietaryPrefs.includes('vegan') && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                ✅ <strong>Vegan selected:</strong> All recipes with animal products (meat, dairy, eggs, honey) will be filtered out
              </div>
            )}
          </div>

          {/* Ingredient Input Section */}
          <div className="filter-group">
            <label htmlFor="ingredient-input" className="block text-sm font-medium text-gray-700 mb-2">
              What ingredients do you have? 🥘
            </label>
            <div className="flex space-x-2">
              <input
                id="ingredient-input"
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter an ingredient (e.g. rice, tomato)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200"
              />
              <button 
                onClick={addIngredient} 
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-sm"
              >
                Add
              </button>
            </div>

            {/* Ingredient Chips */}
            {ingredients.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Selected ingredients:</p>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-2 w-4 h-4 flex items-center justify-center rounded-full bg-blue-200 hover:bg-blue-300 text-blue-600 transition duration-150"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={searchRecipes}
            disabled={loading}
            className="search-btn"
          >
            {loading ? 'Finding Perfect Recipes...' : 'Find My Perfect Recipe! 🔍'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Searching for delicious recipes...</p>
          </div>
        )}

        {/* Recipe Results */}
        {searchPerformed && !loading && (
          <div className="results-section">
            <div className="results-header">
              <h2>Perfect Recipes for You! ({recipes.length} found)</h2>
              <div className="search-context">
                {mood && <span className="context-tag">🎭 {moodOptions.find(m => m.value === mood)?.label}</span>}
                {cookingTime && <span className="context-tag">⏱️ {timeOptions.find(t => t.value === cookingTime)?.label}</span>}
                {skillLevel && <span className="context-tag">👨‍🍳 {skillOptions.find(s => s.value === skillLevel)?.label}</span>}
                {dietaryPrefs.length > 0 && (
                  <span className="context-tag">🥗 {dietaryPrefs.map(pref => 
                    dietaryOptions.find(d => d.value === pref)?.label.replace(/🌱|🥬|🌾|🥩|🥛|🥑/, '')
                  ).join(', ')}</span>
                )}
                {ingredients.length > 0 && (
                  <span className="context-tag">🥘 Using: {ingredients.join(', ')}</span>
                )}
              </div>
            </div>
            
            {recipes.length === 0 ? (
              <div className="no-results">
                <p>No recipes found with your current preferences.</p>
                <p>Try adjusting your mood, time constraints, or ingredients!</p>
              </div>
            ) : (
              <div className="recipes-grid">
                {recipes.map((recipe) => (
                  <div key={recipe.idMeal} className="recipe-card">
                    <div className="recipe-image">
                      <img
                        src={recipe.strMealThumb || `https://via.placeholder.com/300x200/667eea/white?text=${encodeURIComponent('Recipe Image')}`}
                        alt={recipe.strMeal}
                        loading="lazy"
                        onError={handleImageError}
                        crossOrigin="anonymous"
                      />
                      {recipe.perfectMatch && (
                        <div className="perfect-match-badge">✨ Perfect Match!</div>
                      )}
                      <button
                        className={`favorite-btn ${isFavorite(recipe.idMeal) ? 'favorited' : ''}`}
                        onClick={() => toggleFavorite(recipe)}
                        title={isFavorite(recipe.idMeal) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {isFavorite(recipe.idMeal) ? '❤️' : '🤍'}
                      </button>
                    </div>
                    <div className="recipe-content">
                      <h3 className="recipe-title">{recipe.strMeal}</h3>
                      
                      {recipe.moodMatch && (
                        <div className="mood-match">
                          <span className="mood-badge">{recipe.moodMatch}</span>
                        </div>
                      )}
                      
                      {recipe.foundIngredients && recipe.foundIngredients.length > 0 && (
                        <div className="recipe-ingredients">
                          <p className="ingredient-count">
                            Uses {recipe.foundIngredients.length} of your ingredients:
                          </p>
                          <div className="recipe-ingredient-chips">
                            {recipe.foundIngredients.map((ingredient, index) => (
                              <span key={index} className="recipe-ingredient-chip">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {recipe.estimatedTime && (
                        <div className="time-estimate">
                          <span className="time-badge">⏱️ ~{recipe.estimatedTime} mins</span>
                        </div>
                      )}
                      
                      <a
                        href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="recipe-link"
                      >
                        View Full Recipe →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Made for busy professionals who love good food 🥘</p>
      </footer>
    </div>
  );
}

export default App;
