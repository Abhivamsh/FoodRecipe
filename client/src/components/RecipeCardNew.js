import React from 'react';

const RecipeCard = ({ recipe, onRecipeClick, onToggleFavorite, isFavorite }) => {
  return (
    <div 
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 cursor-pointer"
      onClick={() => onRecipeClick(recipe)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Recipe+Image';
          }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition duration-200"
        >
          {isFavorite ? (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        {/* Recipe Category Badge */}
        {recipe.strCategory && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
              {recipe.strCategory}
            </span>
          </div>
        )}

        {/* Perfect Match Badge */}
        {recipe.perfectMatch && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center">
              ✨ Perfect Match
            </span>
          </div>
        )}
      </div>

      {/* Content */}
  <div className="p-6">
        {/* Recipe Title */}
  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-orange-600 transition duration-200 line-clamp-2">
          {recipe.strMeal}
        </h3>

        {/* Recipe Info */}
        <div className="space-y-3">
          {/* Cuisine & Area */}
          {recipe.strArea && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">🌍</span>
              <span>{recipe.strArea} Cuisine</span>
            </div>
          )}

          {/* Cooking Time */}
          {recipe.estimatedTime && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">⏱️</span>
              <span>{recipe.estimatedTime} minutes</span>
            </div>
          )}

          {/* Mood Match */}
          {recipe.moodMatch && (
            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
              <span className="mr-2">💭</span>
              <span className="italic">{recipe.moodMatch}</span>
            </div>
          )}

          {/* Matching Ingredients */}
          {recipe.foundIngredients && recipe.foundIngredients.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Matching ingredients:</p>
              <div className="flex flex-wrap gap-1">
                {recipe.foundIngredients.slice(0, 3).map((ingredient, idx) => (
                  <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                    {ingredient}
                  </span>
                ))}
                {recipe.foundIngredients.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                    +{recipe.foundIngredients.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Click to view recipe</span>
            <svg className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;