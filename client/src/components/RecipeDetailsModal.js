import React, { useState, useEffect } from 'react';

const RecipeDetailsModal = ({ recipe, isOpen, onClose, onToggleFavorite, isFavorite }) => {
  const [fullRecipe, setFullRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && recipe) {
      fetchFullRecipeDetails();
    }
  }, [isOpen, recipe]);

  const fetchFullRecipeDetails = async () => {
    if (!recipe.idMeal) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
      const data = await response.json();
      
      if (data.meals && data.meals[0]) {
        setFullRecipe(data.meals[0]);
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIngredients = () => {
    if (!fullRecipe) return [];
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = fullRecipe[`strIngredient${i}`];
      const measure = fullRecipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    
    return ingredients;
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return [];
    return instructions.split(/\r?\n/).filter(step => step.trim().length > 0);
  };

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-200">
          {/* Header */}
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Recipe Image */}
            <div className="relative h-80 overflow-hidden">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400/f3f4f6/9ca3af?text=Recipe+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Recipe Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{recipe.strMeal}</h1>
                    <div className="flex flex-wrap gap-3">
                      {recipe.strCategory && (
                        <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
                          📂 {recipe.strCategory}
                        </span>
                      )}
                      {recipe.strArea && (
                        <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                          🌍 {recipe.strArea}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => onToggleFavorite(recipe)}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition duration-200"
                  >
                    {isFavorite ? (
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <span className="ml-4 text-gray-600 dark:text-gray-300">Loading recipe details...</span>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Ingredients */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                    🛒 Ingredients
                  </h2>
                  <div className="space-y-3">
                    {getIngredients().map((item, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-200">{item.ingredient}</span>
                        <span className="text-orange-600 font-semibold text-sm">{item.measure}</span>
                      </div>
                    ))}
                  </div>

                  {/* External Links */}
                  <div className="mt-8 space-y-3">
                    {fullRecipe?.strYoutube && (
                      <a 
                        href={fullRecipe.strYoutube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-3 bg-red-600 text-white text-center rounded-xl hover:bg-red-700 transition duration-200 font-medium"
                      >
                        📹 Watch Video Tutorial
                      </a>
                    )}
                    {fullRecipe?.strSource && (
                      <a 
                        href={fullRecipe.strSource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-3 bg-gray-600 text-white text-center rounded-xl hover:bg-gray-700 transition duration-200 font-medium"
                      >
                        📖 Original Recipe Source
                      </a>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                    👨‍🍳 Cooking Instructions
                  </h2>
                  
                  {fullRecipe?.strInstructions ? (
                    <div className="space-y-4">
                      {formatInstructions(fullRecipe.strInstructions).map((step, index) => (
                        <div 
                          key={index}
                          className="flex p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border-l-4 border-orange-500 dark:border-orange-700"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Loading cooking instructions...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;