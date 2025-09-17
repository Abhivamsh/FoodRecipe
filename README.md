# 🍳 Recipe Finder for Taylor - Personal Cooking Assistant

A full-stack application that helps busy professionals like Taylor find perfect recipes based on their **mood, available time, skill level, dietary preferences, and ingredients**. Built with React frontend and Node.js/Express backend, integrating TheMealDB API and optional Gemini AI for personalized recommendations.

## ✨ Enhanced Features

### 🎭 **Mood-Based Cooking**
- **Comfort Food**: Warm, hearty, and satisfying meals
- **Healthy & Fresh**: Light, nutritious, energizing options  
- **Quick Snack**: Fast and easy to prepare
- **Fancy Dinner**: Special occasion, impressive dishes
- **Try Something New**: Adventure in flavors and techniques
- **Nostalgic**: Reminds you of home and familiar tastes

### ⏰ **Time-Aware Filtering**
- **15 minutes**: Super quick meals
- **30 minutes**: Reasonable cooking time
- **1 hour**: Take your time cooking
- **90+ minutes**: Weekend cooking projects

### 👨‍🍳 **Skill Level Matching**
- **Beginner**: Simple and straightforward recipes
- **Intermediate**: Some cooking experience required
- **Advanced**: Bring on the challenge!

### 🥗 **Dietary Intelligence**
- **Vegetarian**: Plant-based options
- **Vegan**: Completely plant-based
- **Gluten-Free**: Safe for gluten sensitivities
- **Low-Carb**: Reduced carbohydrate options
- **Dairy-Free**: No dairy products
- **Keto**: Ketogenic diet friendly

### 🎯 **Quick Scenario Presets**
- **Busy Weeknight**: Quick + Easy + Beginner (30 min)
- **Weekend Cooking**: Experimental + Take Time + Intermediate (90+ min)
- **Date Night**: Fancy + Impressive + Intermediate (60 min)
- **Comfort Evening**: Comfort Food + Satisfying + Easy (60 min)
- **Healthy Kick**: Healthy + Vegetarian + Quick (30 min)

### ❤️ **Personal Recipe Management**
- **Save Favorites**: Heart recipes you love
- **Quick Access**: One-click to favorite recipes
- **Persistent Storage**: Favorites saved across sessions
- **Smart Display**: See your go-to meals at the top

### 🤖 **AI-Enhanced Recommendations**
- **Context-Aware**: Considers all your preferences together
- **Perfect Match Detection**: Highlights recipes that meet multiple criteria
- **Intelligent Fallback**: Works beautifully even without AI
- **Personalized Suggestions**: Tailored specifically to your current needs

## Technology Stack

### Frontend (React)
- React 19.1.1
- Modern CSS with responsive design
- Ingredient chips UI component
- Recipe card grid layout

### Backend (Node.js/Express)
- Express.js server
- TheMealDB API integration
- Optional Gemini REST API integration
- CORS enabled for frontend communication

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation & Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd "C:\Users\DELL\Desktop\Food"
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables (optional)**
   - Edit `server/.env`
   - Add your Gemini API key to enable AI-enhanced results:
     ```
     GEMINI_API_KEY=your_actual_gemini_api_key_here
     ```

### Running the Application

1. **Start the backend server** (in one terminal):
   ```bash
   cd server
   node server.js
   ```
   Server will run on: http://localhost:5000

2. **Start the frontend** (in another terminal):
   ```bash
   cd client
   npm start
   ```
   Application will open at: http://localhost:3000

## How Taylor Uses It - Real Scenarios

### 🏃‍♂️ Monday Evening - Exhausted After Work
**Situation**: "I'm tired, have chicken in the fridge, need dinner in 20 minutes"
- **Action**: Click "Busy Weeknight" → Add "chicken" → Search
- **Result**: Quick, simple chicken recipes perfect for tired evenings

### 💕 Friday Night - Date at Home  
**Situation**: "Want to impress my date, have an hour to cook"
- **Action**: Click "Date Night" → Add available ingredients → Search
- **Result**: Elegant, impressive recipes that won't overwhelm

### 🏠 Saturday Morning - Creative Mode
**Situation**: "I have time and want to try something new"
- **Action**: Click "Weekend Cooking" → Select "Try Something New" mood
- **Result**: Adventurous recipes for culinary exploration

### 🛋️ Sunday Comfort - Need Something Hearty
**Situation**: "Want comfort food that reminds me of home"
- **Action**: Select "Nostalgic" mood → Add available ingredients
- **Result**: Warm, satisfying comfort food recipes

### 💪 New Year - Health Goals
**Situation**: "Starting healthy eating, want vegetarian options"
- **Action**: Click "Healthy Kick" → Select dietary preferences
- **Result**: Nutritious, energizing meal options

## API Endpoints

### GET /api/health
Returns server health status and configuration info.

### GET /api/test
Simple test endpoint to verify server is running.

### GET /api/recipes?ingredients=chicken,rice,tomato
Main endpoint that:
1. Accepts comma-separated ingredients
2. Fetches recipes from TheMealDB API
3. Optionally processes with Gemini AI for refinement
4. Returns structured JSON with recipe data

## Example API Response

```json
{
  "success": true,
  "ingredients": ["chicken", "rice", "tomato"],
  "totalFound": 25,
  "refinedCount": 8,
  "recipes": [
    {
      "idMeal": "52772",
      "strMeal": "Teriyaki Chicken Casserole",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
      "foundIngredients": ["chicken", "rice"],
      "ingredientCount": 2
    }
  ],
  "timestamp": "2025-09-16T06:30:00.000Z"
}
```

## Project Structure

```
Food/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Responsive styling
│   │   └── index.js       # React entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── services/
│   │   ├── mealdbService.js    # TheMealDB API integration
│   │   └── geminiService.js    # Gemini AI integration
│   ├── server.js          # Express server
│   ├── .env              # Environment variables
│   └── package.json
└── README.md
```

## Features in Detail

### Ingredient Management
- Add ingredients via text input
- Visual chip representation
- Easy removal with click
- Duplicate prevention

### Recipe Search
- Parallel API calls to TheMealDB
- Aggregation of results across ingredients
- Ingredient intersection tracking
- Smart fallback when Gemini is unavailable

### AI Enhancement (Optional)
- Gemini API integration for recipe refinement
- Prioritizes recipes with multiple matching ingredients
- Filters for busy professional-friendly recipes
- Graceful degradation when API key not provided

### Responsive Design
- Mobile-first approach
- Grid layout for recipe cards
- Touch-friendly interface
- Professional color scheme

## Troubleshooting

### Backend Issues
- Ensure port 5000 is available
- Check if all npm packages are installed
- Verify .env file configuration

### Frontend Issues
- Ensure port 3000 is available
- Check React scripts compilation
- Verify backend is running before testing

### API Issues
- TheMealDB API requires no authentication
- Gemini API key is optional but enhances results
- Check network connectivity for external API calls

## Demo Workflow

1. **Add ingredients**: chicken, rice, tomato
2. **Search**: Click "Find Recipes"
3. **View results**: Recipe cards with images and ingredient matches
4. **Get recipe**: Click through to full recipe on TheMealDB

## Built for Taylor

This application is specifically designed for busy professionals who:
- Need quick meal inspiration
- Have limited time for meal planning
- Want to use available ingredients efficiently
- Prefer clean, intuitive interfaces

The app prioritizes speed, simplicity, and practicality to fit into a busy professional's lifestyle.