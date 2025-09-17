import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HeroSection from './HeroSection';
import SearchFilters from './SearchFilters';
import RecipeCardNew from './RecipeCardNew';
import RecipeDetailsModal from './RecipeDetailsModal';
import FavoritesSection from './FavoritesSection';
import Footer from './Footer';
import '../App.css';

function RecipeFinder() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favoriteRecipes, setFavoriteRecipes] = useState(
    JSON.parse(localStorage.getItem('favoriteRecipes') || '[]')
  );
  
  // New state for enhanced features
  const [mood, setMood] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [dietaryPrefs, setDietaryPrefs] = useState([]);
  const [skillLevel, setSkillLevel] = useState('');
  
  // Header search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state (kept for potential future use)
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Options data
  const moodOptions = [
    { value: 'comfort', label: 'Comfort Food', description: 'Hearty, warming dishes' },
    { value: 'healthy', label: 'Healthy', description: 'Light, nutritious meals' },
    { value: 'quick', label: 'Quick & Easy', description: 'Fast preparation' },
    { value: 'fancy', label: 'Gourmet', description: 'Special occasion meals' },
    { value: 'experimental', label: 'Adventurous', description: 'Try something new' },
    { value: 'nostalgic', label: 'Nostalgic', description: 'Classic, familiar flavors' }
  ];

  const timeOptions = [
    { value: 'quick', label: '15-30 min', description: 'Quick meals' },
    { value: 'medium', label: '30-60 min', description: 'Moderate cooking' },
    { value: 'long', label: '1+ hours', description: 'Slow cooking, elaborate dishes' }
  ];

  const skillOptions = [
    { value: 'beginner', label: 'Beginner', description: 'Simple recipes, basic techniques' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some cooking experience' },
    { value: 'advanced', label: 'Advanced', description: 'Complex techniques, experienced cook' }
  ];

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'dairy-free', label: 'Dairy Free' },
    { value: 'low-carb', label: 'Low Carb' },
    { value: 'keto', label: 'Keto' }
  ];

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, currentIngredient.trim().toLowerCase()]);
      setCurrentIngredient('');
    }
  };

  const addIngredientByName = (ingredientName) => {
    console.log('addIngredientByName called with:', ingredientName);
    console.log('Current ingredients:', ingredients);
    if (ingredientName.trim() && !ingredients.includes(ingredientName.trim().toLowerCase())) {
      console.log('Adding ingredient:', ingredientName.trim().toLowerCase());
      setIngredients([...ingredients, ingredientName.trim().toLowerCase()]);
    } else {
      console.log('Ingredient already exists or is empty');
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  const toggleDietaryPref = (pref) => {
    setDietaryPrefs(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const toggleFavorite = (recipe) => {
    const updatedFavorites = favoriteRecipes.find(fav => fav.idMeal === recipe.idMeal)
      ? favoriteRecipes.filter(fav => fav.idMeal !== recipe.idMeal)
      : [...favoriteRecipes, recipe];
    
    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.idMeal}`);
  };

  const isFavorite = (recipe) => {
    return favoriteRecipes.some(fav => fav.idMeal === recipe.idMeal);
  };

  const handleHeaderSearch = () => {
    if (searchQuery.trim()) {
      setIngredients([searchQuery.trim().toLowerCase()]);
      setSearchQuery('');
      searchRecipes();
    }
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0 && !mood && !cookingTime && !skillLevel && dietaryPrefs.length === 0) {
      setError('Please add at least one ingredient or select preferences to search for recipes');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams();
      
      if (ingredients.length > 0) {
        queryParams.append('ingredients', ingredients.join(','));
      }
      if (mood) queryParams.append('mood', mood);
      if (cookingTime) queryParams.append('cookingTime', cookingTime);
      if (skillLevel) queryParams.append('skillLevel', skillLevel);
      if (dietaryPrefs.length > 0) {
        queryParams.append('dietary', dietaryPrefs.join(','));
      }

      console.log('Searching with params:', queryParams.toString());

      const response = await fetch(`http://localhost:5000/api/recipes?${queryParams.toString()}`);
      const data = await response.json();
      
      console.log('API Response:', data);

      if (data.success) {
        const searchParams = {
          ingredients: ingredients.join(','),
          mood,
          cookingTime,
          skillLevel,
          dietary: dietaryPrefs.join(',')
        };
        
        // Navigate to results page with search data
        navigate('/results', { 
          state: { 
            recipes: data.recipes || [], 
            searchParams,
            searchCriteria: {
              ingredients,
              mood,
              cookingTime,
              skillLevel,
              dietaryPrefs
            }
          } 
        });
      } else {
        setError(data.error || 'Failed to fetch recipes');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header Component */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleHeaderSearch}
      />

      {/* Hero Section */}
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 pb-8">
        {/* Favorites Section */}
        {favoriteRecipes.length > 0 && (
          <div className="mb-8">
            <FavoritesSection 
              favoriteRecipes={favoriteRecipes}
              onRecipeClick={handleRecipeClick}
            />
          </div>
        )}

        {/* Search Filters */}
        <SearchFilters
          mood={mood}
          setMood={setMood}
          cookingTime={cookingTime}
          setCookingTime={setCookingTime}
          skillLevel={skillLevel}
          setSkillLevel={setSkillLevel}
          dietaryPrefs={dietaryPrefs}
          toggleDietaryPref={toggleDietaryPref}
          ingredients={ingredients}
          currentIngredient={currentIngredient}
          setCurrentIngredient={setCurrentIngredient}
          addIngredient={addIngredient}
          addIngredientByName={addIngredientByName}
          removeIngredient={removeIngredient}
          handleKeyPress={handleKeyPress}
          searchRecipes={searchRecipes}
          loading={loading}
        />

        {/* Error Message */}
        {error && (
          <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <div className="text-red-700 dark:text-red-400 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">Finding delicious recipes for you...</p>
          </div>
        )}
      </main>

      {/* Recipe Details Modal */}
      <RecipeDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={selectedRecipe}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default RecipeFinder;