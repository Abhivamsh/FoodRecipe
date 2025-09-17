import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const mealDbApi = {
  // Search meal by name
  searchByName: async (mealName) => {
    try {
      const response = await axios.get(`${BASE_URL}/search.php?s=${mealName}`);
      return response.data;
    } catch (error) {
      console.error('Error searching by name:', error);
      throw error;
    }
  },

  // Search meals by first letter
  searchByFirstLetter: async (letter) => {
    try {
      const response = await axios.get(`${BASE_URL}/search.php?f=${letter}`);
      return response.data;
    } catch (error) {
      console.error('Error searching by first letter:', error);
      throw error;
    }
  },

  // Get meal details by ID
  getMealById: async (mealId) => {
    try {
      const response = await axios.get(`${BASE_URL}/lookup.php?i=${mealId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting meal by ID:', error);
      throw error;
    }
  },

  // Get random meal
  getRandomMeal: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/random.php`);
      return response.data;
    } catch (error) {
      console.error('Error getting random meal:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories.php`);
      return response.data;
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  },

  // Get list of categories
  getCategoryList: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/list.php?c=list`);
      return response.data;
    } catch (error) {
      console.error('Error getting category list:', error);
      throw error;
    }
  },

  // Get list of areas
  getAreaList: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/list.php?a=list`);
      return response.data;
    } catch (error) {
      console.error('Error getting area list:', error);
      throw error;
    }
  },

  // Get list of ingredients
  getIngredientList: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/list.php?i=list`);
      return response.data;
    } catch (error) {
      console.error('Error getting ingredient list:', error);
      throw error;
    }
  },

  // Filter by ingredient
  filterByIngredient: async (ingredient) => {
    try {
      const response = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering by ingredient:', error);
      throw error;
    }
  },

  // Filter by category
  filterByCategory: async (category) => {
    try {
      const response = await axios.get(`${BASE_URL}/filter.php?c=${category}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering by category:', error);
      throw error;
    }
  },

  // Filter by area
  filterByArea: async (area) => {
    try {
      const response = await axios.get(`${BASE_URL}/filter.php?a=${area}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering by area:', error);
      throw error;
    }
  },

  // Helper functions for thumbnails
  getMealThumbnail: (mealId) => `https://www.themealdb.com/images/media/meals/${mealId}.jpg`,
  getIngredientThumbnail: (ingredient) => `https://www.themealdb.com/images/ingredients/${ingredient}-medium.png`
};