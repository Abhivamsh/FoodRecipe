import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ClockIcon, ExternalLinkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function RecipeModal({ 
  recipe, 
  isOpen, 
  onClose, 
  isFavorite, 
  toggleFavorite, 
  handleImageError 
}) {
  if (!recipe) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Modal Header */}
                <div className="relative">
                  <img
                    src={recipe.strMealThumb || `https://via.placeholder.com/600x300/667eea/white?text=${encodeURIComponent('Recipe Image')}`}
                    alt={recipe.strMeal}
                    onError={handleImageError}
                    crossOrigin="anonymous"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  
                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(recipe)}
                    className="absolute top-4 left-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200"
                  >
                    {isFavorite(recipe.idMeal) ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  
                  {/* Recipe title overlay */}
                  <div className="absolute bottom-4 left-6 right-6">
                    <h2 className="text-2xl font-bold text-white">{recipe.strMeal}</h2>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Recipe Details */}
                    <div className="flex flex-wrap gap-4">
                      {recipe.estimatedTime && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                          <ClockIcon className="h-4 w-4" />
                          ~{recipe.estimatedTime} minutes
                        </div>
                      )}
                      
                      {recipe.moodMatch && (
                        <div className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                          {recipe.moodMatch}
                        </div>
                      )}
                      
                      {recipe.perfectMatch && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-sm font-semibold text-white">
                          ✨ Perfect Match!
                        </div>
                      )}
                    </div>

                    {/* Ingredients you have */}
                    {recipe.foundIngredients && recipe.foundIngredients.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Uses {recipe.foundIngredients.length} of your ingredients:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {recipe.foundIngredients.map((ingredient, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                            >
                              ✓ {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recipe description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About this recipe</h3>
                      <p className="text-gray-600 leading-relaxed">
                        This delicious {recipe.strMeal} recipe is perfect for your current mood and available ingredients. 
                        {recipe.moodMatch && ` It's especially great when you're looking for ${recipe.moodMatch.toLowerCase()}.`}
                        {recipe.estimatedTime && ` With an estimated cooking time of ${recipe.estimatedTime} minutes, it fits perfectly into your schedule.`}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <a
                        href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors duration-200"
                      >
                        <ExternalLinkIcon className="h-5 w-5" />
                        View Full Recipe & Instructions
                      </a>
                      <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}