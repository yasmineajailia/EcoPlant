// Utility to manage recently viewed plants
const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_RECENT_ITEMS = 10;

export const addToRecentlyViewed = (plant) => {
  try {
    let recentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(item => item._id !== plant._id);
    
    // Add to beginning
    recentlyViewed.unshift(plant);
    
    // Keep only last MAX_RECENT_ITEMS
    recentlyViewed = recentlyViewed.slice(0, MAX_RECENT_ITEMS);
    
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  } catch (error) {
    console.error('Error saving to recently viewed:', error);
  }
};

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

export const clearRecentlyViewed = () => {
  localStorage.removeItem(RECENTLY_VIEWED_KEY);
};
