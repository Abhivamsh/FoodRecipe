import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeFinder from './components/RecipeFinder';
import ResultsPage from './components/ResultsPage';
import RecipeDetails from './components/RecipeDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeFinder />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;