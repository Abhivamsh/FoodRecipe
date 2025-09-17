import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🍕</div>
        <div className="absolute top-32 right-20 text-4xl">🥗</div>
        <div className="absolute bottom-20 left-1/4 text-5xl">🍳</div>
        <div className="absolute bottom-10 right-10 text-3xl">🥘</div>
        <div className="absolute top-1/2 left-10 text-4xl">🍝</div>
        <div className="absolute top-20 left-1/2 text-3xl">🥙</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">
            Discover Your Next
            <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Favorite Recipe
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-200">
            Let AI help you find the perfect meal based on your ingredients, mood, and preferences. 
            From quick weeknight dinners to gourmet weekend projects.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <span className="text-orange-500 mr-2">🤖</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">AI-Powered Suggestions</span>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <span className="text-green-500 mr-2">🥬</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Dietary Preferences</span>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <span className="text-blue-500 mr-2">⏱️</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Time-Based Filtering</span>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <span className="text-purple-500 mr-2">💝</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Save Favorites</span>
            </div>
          </div>

          

          {/* Chef Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200">
                <span className="text-9xl">👨‍🍳</span>
              </div>
            </div>
          </div>
        </div>
      </div>  

      {/* Customization Info Box */}
          <div className="max-w-2xl mx-auto p-6 top-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-between transition-colors duration-200">
              <span>⚙️ Customize Your Recipe Search</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
                <span><span className="text-red-500">*</span> Compulsory</span>
                <span><span className="text-gray-400">@</span> Optional</span>
              </div>
            </h3>
          </div>    

      {/* Wave Separator */}
      <div className="absolute top-0 bottom-0 left-0 right-0">
        <svg className="w-full h-8 text-white dark:text-gray-800" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="currentColor">
          <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;