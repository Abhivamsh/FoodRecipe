import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      
      if (data.meals && data.meals[0]) {
        setRecipe(data.meals[0]);
      } else {
        setError('Recipe not found');
      }
    } catch (err) {
      setError('Failed to fetch recipe details');
      console.error('Error fetching recipe details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIngredients = () => {
    if (!recipe) return [];
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 dark:text-red-400 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-xl mb-4">Recipe not found</div>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients();
  const instructions = formatInstructions(recipe.strInstructions);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with dark mode toggle */}
      <Header />
      
      {/* Back button section */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => {
              // Try to go back to previous page, fallback to home
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border dark:border-gray-700">
          {/* Recipe Header */}
          <div className="relative">
            <img 
              src={recipe.strMealThumb} 
              alt={recipe.strMeal}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Recipe+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl font-bold text-white mb-2">{recipe.strMeal}</h1>
              <div className="flex flex-wrap gap-4 text-white">
                {recipe.strCategory && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    📂 {recipe.strCategory}
                  </span>
                )}
                {recipe.strArea && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    🌍 {recipe.strArea}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Ingredients */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                  🛒 Ingredients
                </h2>
                <div className="space-y-3">
                  {ingredients.map((item, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700"
                    >
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.ingredient}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{item.measure}</span>
                    </div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="mt-8 space-y-4">
                  {recipe.strYoutube && (
                    <a 
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 bg-red-600 dark:bg-red-700 text-white text-center rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition duration-200"
                    >
                      📹 Watch Video Tutorial
                    </a>
                  )}
                  {recipe.strSource && (
                    <a 
                      href={recipe.strSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 bg-gray-600 dark:bg-gray-700 text-white text-center rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition duration-200"
                    >
                      📖 Original Recipe Source
                    </a>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                  👨‍🍳 Instructions
                </h2>
                <div className="space-y-4">
                  {instructions.map((step, index) => (
                    <div 
                      key={index}
                      className="flex p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border-l-4 border-blue-500 dark:border-blue-400"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;