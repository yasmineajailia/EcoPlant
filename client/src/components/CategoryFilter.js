import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCategoryInFrench } from '../utils/translations';
import './CategoryFilter.css';

const CategoryFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { value: '', label: 'Toutes', icon: '' },
    { value: 'indoor', label: 'Intérieur', icon: '' },
    { value: 'outdoor', label: 'Extérieur', icon: '' },
    { value: 'succulent', label: 'Succulentes', icon: '' },
    { value: 'flower', label: 'Fleurs', icon: '' },
    { value: 'tree', label: 'Arbres', icon: '' },
    { value: 'herb', label: 'Herbes', icon: '' }
  ];

  const getCurrentCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || '';
  };

  const handleCategoryClick = (categoryValue) => {
    if (categoryValue === '') {
      navigate('/plants');
    } else {
      navigate(`/plants?category=${categoryValue}`);
    }
  };

  const currentCategory = getCurrentCategory();

  return (
    <div className="category-filter-bar">
      <div className="category-filter-content">
        {categories.map((category) => (
          <button
            key={category.value}
            className={`category-btn ${currentCategory === category.value ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.value)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
