// Utility function to translate categories to French
export const getCategoryInFrench = (category) => {
  const translations = {
    'indoor': 'Intérieur',
    'outdoor': 'Extérieur',
    'succulent': 'Succulente',
    'flower': 'Fleur',
    'tree': 'Arbre',
    'herb': 'Herbe',
    'other': 'Autre'
  };
  
  return translations[category] || category;
};

// Utility function to translate size to French
export const getSizeInFrench = (size) => {
  const translations = {
    'small': 'Petite',
    'medium': 'Moyenne',
    'large': 'Grande'
  };
  
  return translations[size] || size;
};
