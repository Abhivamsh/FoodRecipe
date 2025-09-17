import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              🍳 Recipe Finder
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Discover delicious recipes tailored to your preferences, ingredients, and cooking style. 
              Make every meal a delightful experience.
            </p>
            <div className="flex space-x-4">
              <span className="text-2xl">🥘</span>
              <span className="text-2xl">🍕</span>
              <span className="text-2xl">🥗</span>
              <span className="text-2xl">🍰</span>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Smart Recipe Search
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ingredient-Based Filtering
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Dietary Preferences
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Favorites Collection
              </li>
            </ul>
          </div>

          {/* Data Sources Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">Powered By</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <p className="font-medium">TheMealDB</p>
                  <p className="text-sm text-gray-400">Recipe Database</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <div>
                  <p className="font-medium">Gemini AI</p>
                  <p className="text-sm text-gray-400">Smart Recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Recipe Finder. Built with React & Tailwind CSS.
            </p>
            <p className="text-gray-400 text-sm">
              Made with ❤️ for food lovers everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
