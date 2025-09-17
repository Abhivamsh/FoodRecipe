import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import RecipeCardNew from './RecipeCardNew';
import RecipeDetailsModal from './RecipeDetailsModal';
import Footer from './Footer';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState(
    JSON.parse(localStorage.getItem('favoriteRecipes')) || []
  );

  // Get data from navigation state
  const { recipes = [], searchParams = {}, searchCriteria = {} } = location.state || {};

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.idMeal}`);
  };

  const toggleFavorite = (recipe) => {
    const updatedFavorites = favoriteRecipes.find(fav => fav.idMeal === recipe.idMeal)
      ? favoriteRecipes.filter(fav => fav.idMeal !== recipe.idMeal)
      : [...favoriteRecipes, recipe];
    
    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (recipe) => {
    return favoriteRecipes.some(fav => fav.idMeal === recipe.idMeal);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // If no data, redirect to home
  if (!location.state) {
    navigate('/');
    return null;
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header Component */}
      <Header 
        searchQuery=""
        setSearchQuery={() => {}}
        onSearch={() => {}}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button and Results Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToHome}
            className="group flex items-center text-gray-600 hover:text-orange-600 font-medium mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              🍽️ Found {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''} for You!
            </h1>
            
            {/* Search Summary */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 transition-colors duration-200">
              <h3 className="font-semibold text-gray-700 mb-2">Your Search Criteria:</h3>
              <div className="flex flex-wrap gap-2">
                {searchCriteria.ingredients && searchCriteria.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-sm text-gray-600">Ingredients:</span>
                    {searchCriteria.ingredients.map((ingredient, idx) => (
                      <span key={idx} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-sm">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                )}
                {searchCriteria.mood && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                    Mood: {searchCriteria.mood}
                  </span>
                )}
                {searchCriteria.cookingTime && (
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                    Time: {searchCriteria.cookingTime}
                  </span>
                )}
                {searchCriteria.skillLevel && (
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full text-sm">
                    Skill: {searchCriteria.skillLevel}
                  </span>
                )}
                {searchCriteria.dietaryPrefs && searchCriteria.dietaryPrefs.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-sm text-gray-600">Dietary:</span>
                    {searchCriteria.dietaryPrefs.map((pref, idx) => (
                      <span key={idx} className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-sm">
                        {pref}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mt-4">Click on any recipe card to view detailed instructions</p>
          </div>
        </div>

        {/* Results Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCardNew
                key={recipe.idMeal}
                recipe={recipe}
                onRecipeClick={handleRecipeClick}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(recipe)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center transition-colors duration-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No recipes found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your search criteria or adding different ingredients</p>
            <button
              onClick={handleBackToHome}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
            >
              Try New Search
            </button>
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

export default ResultsPage;