import React, { useState, useEffect } from 'react';

const SearchFilters = ({ 
  mood, setMood, 
  cookingTime, setCookingTime, 
  skillLevel, setSkillLevel, 
  dietaryPrefs, toggleDietaryPref,
  ingredients, currentIngredient, setCurrentIngredient,
  addIngredient, addIngredientByName, removeIngredient, handleKeyPress,
  searchRecipes, loading
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Common ingredients for auto-suggestions
  const commonIngredients = [
    'chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'turkey', 'lamb',
    'rice', 'pasta', 'bread', 'flour', 'oats', 'quinoa', 'barley',
    'tomato', 'onion', 'garlic', 'carrot', 'potato', 'bell pepper', 'mushroom',
    'broccoli', 'spinach', 'lettuce', 'cucumber', 'avocado', 'corn', 'beans',
    'cheese', 'milk', 'butter', 'eggs', 'yogurt', 'cream', 'mozzarella',
    'olive oil', 'coconut oil', 'salt', 'pepper', 'basil', 'oregano', 'thyme',
    'cumin', 'paprika', 'ginger', 'turmeric', 'cinnamon', 'vanilla',
    'lemon', 'lime', 'orange', 'apple', 'banana', 'strawberry', 'blueberry',
    'honey', 'sugar', 'brown sugar', 'maple syrup', 'soy sauce', 'vinegar'
  ];

  // Filter suggestions based on user input
  useEffect(() => {
    if (currentIngredient.length > 0) {
      const filtered = commonIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(currentIngredient.toLowerCase()) &&
        !ingredients.includes(ingredient.toLowerCase())
      ).slice(0, 6); // Show max 6 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentIngredient, ingredients]);

  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion);
    setShowSuggestions(false);
    // Clear the input field
    setCurrentIngredient('');
    // Directly add the ingredient using the new function
    addIngredientByName(suggestion);
    console.log('Ingredient should be added:', suggestion);
  };

  const handleInputFocus = () => {
    if (currentIngredient.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 300);
  };
  const moodOptions = [
    { value: '', label: 'Any Mood' },
    { value: 'comfort', label: '🏠 Comfort Food' },
    { value: 'healthy', label: '🥗 Healthy & Fresh' },
    { value: 'quick', label: '⚡ Quick & Easy' },
    { value: 'fancy', label: '🍽️ Gourmet' },
    { value: 'experimental', label: '🧪 Adventurous' },
    { value: 'nostalgic', label: '❤️ Nostalgic' }
  ];

  const timeOptions = [
    { value: '', label: 'Any Time' },
    { value: 'quick', label: '⏱️ 15-30 min' },
    { value: 'medium', label: '🕐 30-60 min' },
    { value: 'long', label: '⏰ 1+ hours' }
  ];

  const skillOptions = [
    { value: '', label: 'Any Skill Level' },
    { value: 'beginner', label: '👶 Beginner' },
    { value: 'intermediate', label: '👨‍🍳 Intermediate' },
    { value: 'advanced', label: '🔥 Advanced' }
  ];

  const dietaryOptions = [
    { value: 'vegetarian', label: '🌱 Vegetarian' },
    { value: 'non-vegetarian', label: '🍖 Non-Vegetarian' },
    { value: 'vegan', label: '🥬 Vegan' },
    { value: 'gluten-free', label: '🌾 Gluten-Free' },
    { value: 'dairy-free', label: '🥛 Dairy-Free' },
    { value: 'low-carb', label: '🥩 Low-Carb' },
    { value: 'keto', label: '🥑 Keto' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 space-y-8 transition-colors duration-200">
      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mood Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">@ Cooking Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 appearance-none cursor-pointer"
          >
            {moodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">@ Cooking Time</label>
          <select
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 appearance-none cursor-pointer"
          >
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Level Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">@ Skill Level</label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 appearance-none cursor-pointer"
          >
            {skillOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dietary Preferences */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4"> <span className="text-red-500">*</span> Dietary Preferences</label>
        <div className="flex flex-wrap gap-3">
          {dietaryOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleDietaryPref(option.value)}
              className={`px-4 py-2 rounded-full border-2 transition duration-200 font-medium ${
                dietaryPrefs.includes(option.value)
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Dietary Preference Messages */}
        {dietaryPrefs.includes('vegetarian') && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✅ <strong> Vegetarian selected:</strong> All recipes with meat, poultry, fish, and seafood will be filtered out
          </div>
        )}
        {dietaryPrefs.includes('non-vegetarian') && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            🍖 <strong>Non-Vegetarian selected:</strong> Only recipes with meat, poultry, fish, or seafood will be shown
          </div>
        )}
        {dietaryPrefs.includes('vegan') && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            🌱 <strong>Vegan selected:</strong> All recipes with animal products (meat, dairy, eggs, honey) will be filtered out
          </div>
        )}
        {dietaryPrefs.includes('vegetarian') && dietaryPrefs.includes('non-vegetarian') && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            ⚠️ <strong>Conflicting preferences:</strong> You have both Vegetarian and Non-Vegetarian selected. This may result in no recipes being found.
          </div>
        )}
      </div>

      {/* Ingredients Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4"> <span className="text-red-500">*</span> Available Ingredients</label>
        
        {/* Ingredient Input with Auto-suggestions */}
        <div className="relative">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Add an ingredient (e.g., chicken, tomato)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              />
              
              {/* Auto-suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-400 transition duration-150 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <span className="flex items-center">
                        <span className="mr-2"></span>
                        <span className="capitalize">{suggestion}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={addIngredient}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition duration-200"
            >
              Add
            </button>
          </div>
        </div>

        {/* Ingredient Tags */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-2 w-4 h-4 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700 text-blue-600 dark:text-blue-300 transition duration-150"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={searchRecipes}
          disabled={loading}
          className="group bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Searching Recipes...
              </>
            ) : (
              <>
                🔍 Find Perfect Recipes
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;