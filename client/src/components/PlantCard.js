import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getCategoryInFrench } from '../utils/translations';
import QuickView from './QuickView';
import './PlantCard.css';

const PlantCard = ({ plant }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showQuickView, setShowQuickView] = useState(false);
  
  const displayPrice = plant.onPromotion && plant.promotionPrice 
    ? plant.promotionPrice 
    : plant.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(plant, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (isInWishlist(plant._id)) {
      removeFromWishlist(plant._id);
    } else {
      addToWishlist(plant);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  return (
    <>
      <div className="plant-card">
        <div className="card-actions">
          <button 
            className={`btn-icon wishlist-btn ${isInWishlist(plant._id) ? 'active' : ''}`}
            onClick={handleWishlist}
            title={isInWishlist(plant._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {isInWishlist(plant._id) ? '❤️' : '🤍'}
          </button>
          <button 
            className="btn-icon quick-view-btn"
            onClick={handleQuickView}
            title="Aperçu rapide"
          >
            👁️
          </button>
        </div>

        <Link to={`/plants/${plant._id}`} className="plant-card-link">
        <div className="plant-image">
          {plant.images && plant.images.length > 0 ? (
            <img src={plant.images[0]} alt={plant.name} />
          ) : (
            <div className="no-image">🌱</div>
          )}
          {plant.onPromotion && (
            <span className="promo-badge">Promo!</span>
          )}
          {!plant.available && (
            <span className="stock-badge">Rupture</span>
          )}
        </div>
        
        <div className="plant-info">
          <h3 className="plant-name">{plant.name}</h3>
          <p className="plant-category">{getCategoryInFrench(plant.category)}</p>
          
          <div className="plant-footer">
            <div className="plant-price">
              {plant.onPromotion && plant.promotionPrice ? (
                <>
                  <span className="original-price">{plant.price.toFixed(2)} TND</span>
                  <span className="promo-price">{displayPrice.toFixed(2)} TND</span>
                </>
              ) : (
                <span className="price">{displayPrice.toFixed(2)} TND</span>
              )}
            </div>
            
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
              disabled={!plant.available}
            >
              {plant.available ? 'Ajouter' : 'Indisponible'}
            </button>
          </div>
        </div>
      </Link>
    </div>

    {showQuickView && (
      <QuickView plant={plant} onClose={() => setShowQuickView(false)} />
    )}
  </>
  );
};

export default PlantCard;
