import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getCategoryInFrench, getSizeInFrench } from '../utils/translations';
import './QuickView.css';

const QuickView = ({ plant, onClose }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!plant) return null;

  const displayPrice = plant.onPromotion && plant.promotionPrice 
    ? plant.promotionPrice 
    : plant.price;

  const handleAddToCart = () => {
    addToCart(plant, quantity);
    onClose();
  };

  const handleWishlist = () => {
    if (isInWishlist(plant._id)) {
      removeFromWishlist(plant._id);
    } else {
      addToWishlist(plant);
    }
  };

  const handleViewFull = () => {
    navigate(`/plants/${plant._id}`);
    onClose();
  };

  return (
    <div className="quick-view-overlay" onClick={onClose}>
      <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✕</button>
        
        <div className="quick-view-content">
          {/* Image Section */}
          <div className="quick-view-images">
            <div className={`main-image ${isZoomed ? 'zoomed' : ''}`}>
              {plant.images && plant.images.length > 0 ? (
                <img 
                  src={plant.images[selectedImage]} 
                  alt={plant.name}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              ) : (
                <div className="no-image">🌱</div>
              )}
              {plant.onPromotion && (
                <span className="promo-badge">Promo!</span>
              )}
            </div>
            
            {plant.images && plant.images.length > 1 && (
              <div className="image-thumbnails">
                {plant.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${plant.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="quick-view-info">
            <div className="badges">
              {plant.featured && <span className="badge featured">⭐ Vedette</span>}
            </div>

            <h2>{plant.name}</h2>
            
            <div className="meta-info">
              <span><strong>Catégorie:</strong> {getCategoryInFrench(plant.category)}</span>
              <span><strong>Taille:</strong> {getSizeInFrench(plant.size)}</span>
            </div>

            <div className="price-section">
              {plant.onPromotion && plant.promotionPrice ? (
                <>
                  <span className="original-price">{plant.price.toFixed(2)} TND</span>
                  <span className="current-price promo">{displayPrice.toFixed(2)} TND</span>
                </>
              ) : (
                <span className="current-price">{displayPrice.toFixed(2)} TND</span>
              )}
            </div>

            <p className="description">
              {plant.description?.substring(0, 200)}...
            </p>

            <div className="stock-info">
              <strong>Stock:</strong> {plant.stock > 0 ? `${plant.stock} disponible(s)` : 'Rupture de stock'}
            </div>

            {plant.stock > 0 && (
              <div className="quantity-section">
                <label>Quantité:</label>
                <div className="quantity-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => setQuantity(Math.min(plant.stock, quantity + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="quick-view-actions">
              <button 
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={plant.stock === 0}
              >
                🛒 Ajouter au panier
              </button>
              
              <button 
                className={`btn-wishlist ${isInWishlist(plant._id) ? 'active' : ''}`}
                onClick={handleWishlist}
                title={isInWishlist(plant._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {isInWishlist(plant._id) ? '❤️' : '🤍'}
              </button>
            </div>

            <button className="btn btn-outline" onClick={handleViewFull}>
              Voir tous les détails →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
