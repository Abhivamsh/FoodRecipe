import React from 'react';
import { HeartIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function RecipeCard({ 
  recipe, 
  isFavorite, 
  toggleFavorite, 
  onRecipeClick,
  handleImageError 
}) {
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Recipe Image */}
  <div className="relative aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-800">
        <img
          src={recipe.strMealThumb || `https://via.placeholder.com/300x200/667eea/white?text=${encodeURIComponent('Recipe Image')}`}
          alt={recipe.strMeal}
          loading="lazy"
          onError={handleImageError}
          crossOrigin="anonymous"
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Perfect match badge */}
        {recipe.perfectMatch && (
          <div className="absolute top-3 left-3">
            <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg dark:from-amber-500 dark:to-yellow-600">
              <SparklesIcon className="h-3 w-3" />
              Perfect Match!
            </div>
          </div>
        )}
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
          title={isFavorite(recipe.idMeal) ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite(recipe.idMeal) ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Recipe Content */}
  <div className="p-6">
  <div className="space-y-4">
          {/* Recipe Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {recipe.strMeal}
          </h3>
          
          {/* Mood Match */}
          {recipe.moodMatch && (
            <div className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-sm font-medium text-primary-800 dark:text-primary-200">
              {recipe.moodMatch}
            </div>
          )}
          
          {/* Ingredients */}
          {recipe.foundIngredients && recipe.foundIngredients.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Uses {recipe.foundIngredients.length} of your ingredients:
              </p>
              <div className="flex flex-wrap gap-1">
                {recipe.foundIngredients.slice(0, 3).map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-200"
                  >
                    {ingredient}
                  </span>
                ))}
                {recipe.foundIngredients.length > 3 && (
                  <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-300">
                    +{recipe.foundIngredients.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Time Estimate */}
          {recipe.estimatedTime && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <ClockIcon className="h-4 w-4" />
              <span>~{recipe.estimatedTime} mins</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
  <div className="mt-6 flex gap-3">
          <button
            onClick={() => onRecipeClick(recipe)}
            className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors duration-200"
          >
            View Details
          </button>
          <a
            href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            Full Recipe →
          </a>
        </div>
      </div>
    </div>
  );
}