import React from 'react';

function FavoritesSection({ favoriteRecipes, onRecipeClick }) {
  if (!favoriteRecipes || favoriteRecipes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center text-2xl font-bold text-gray-800">
          <span className="mr-3 text-3xl">⭐</span>
          Your Favorite Recipes
        </div>
        <div className="ml-auto bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
          {favoriteRecipes.length} saved
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteRecipes.slice(0, 6).map((recipe) => (
          <div 
            key={recipe.idMeal} 
            className="group cursor-pointer bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 hover:shadow-lg hover:border-orange-300 transition-all duration-300"
            onClick={() => onRecipeClick(recipe)}
          >
            <div className="relative overflow-hidden rounded-lg mb-3">
              <img 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Recipe+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <h3 className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors duration-200 line-clamp-2">
              {recipe.strMeal}
            </h3>
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">Click to view</span>
              <svg className="w-4 h-4 text-orange-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      {favoriteRecipes.length > 6 && (
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            And {favoriteRecipes.length - 6} more favorite{favoriteRecipes.length - 6 !== 1 ? 's' : ''}...
          </p>
        </div>
      )}
    </div>
  );
}

export default FavoritesSection;
