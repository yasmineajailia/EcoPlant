import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getCategoryInFrench, getSizeInFrench } from '../utils/translations';
import { addToRecentlyViewed, getRecentlyViewed } from '../utils/recentlyViewed';
import PlantCard from '../components/PlantCard';
import './PlantDetails.css';

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [plant, setPlant] = useState(null);
  const [similarPlants, setSimilarPlants] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    fetchPlant();
    loadRecentlyViewed();
  }, [id]);

  const fetchPlant = async () => {
    try {
      const { data } = await API.get(`/plants/${id}`);
      setPlant(data.data);
      
      // Add to recently viewed
      addToRecentlyViewed(data.data);
      
      // Fetch similar plants
      fetchSimilarPlants(data.data.category, id);
    } catch (error) {
      console.error('Error fetching plant:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarPlants = async (category, currentId) => {
    try {
      const { data } = await API.get(`/plants?category=${category}`);
      const filtered = data.data.filter(p => p._id !== currentId).slice(0, 4);
      setSimilarPlants(filtered);
    } catch (error) {
      console.error('Error fetching similar plants:', error);
    }
  };

  const loadRecentlyViewed = () => {
    const recent = getRecentlyViewed();
    const filtered = recent.filter(p => p._id !== id).slice(0, 4);
    setRecentlyViewed(filtered);
  };

  const handleAddToCart = () => {
    addToCart(plant, quantity);
    navigate('/cart');
  };

  const handleWishlist = () => {
    if (isInWishlist(plant._id)) {
      removeFromWishlist(plant._id);
    } else {
      addToWishlist(plant);
    }
  };

  const handleImageNavigation = (direction) => {
    if (!plant.images || plant.images.length <= 1) return;
    
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % plant.images.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + plant.images.length) % plant.images.length);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>Plante non trouvée</h2>
        <button className="btn btn-primary" onClick={() => navigate('/plants')}>
          Retour au catalogue
        </button>
      </div>
    );
  }

  const displayPrice = plant.onPromotion && plant.promotionPrice 
    ? plant.promotionPrice 
    : plant.price;

  return (
    <div className="plant-details">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/plants')}>
          ← Retour au catalogue
        </button>

        <div className="details-grid">
          {/* Images Section */}
          <div className="images-section">
            <div className={`main-image ${isZoomed ? 'zoomed' : ''}`}>
              {plant.images && plant.images.length > 0 ? (
                <>
                  <img 
                    src={plant.images[selectedImage]} 
                    alt={plant.name}
                    onClick={() => setIsZoomed(!isZoomed)}
                    style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
                  />
                  {plant.images.length > 1 && !isZoomed && (
                    <>
                      <button className="nav-btn prev" onClick={() => handleImageNavigation('prev')}>‹</button>
                      <button className="nav-btn next" onClick={() => handleImageNavigation('next')}>›</button>
                      <div className="image-counter">
                        {selectedImage + 1} / {plant.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="no-image-large">🌱</div>
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
          <div className="info-section">
            <div className="badges">
              {plant.onPromotion && <span className="badge promo">Promotion</span>}
              {plant.featured && <span className="badge featured">Vedette</span>}
              {!plant.stock && <span className="badge out-of-stock">Rupture de stock</span>}
            </div>

            <div className="title-wishlist">
              <h1 className="plant-title">{plant.name}</h1>
              <button 
                className={`btn-wishlist-large ${isInWishlist(plant._id) ? 'active' : ''}`}
                onClick={handleWishlist}
                title={isInWishlist(plant._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {isInWishlist(plant._id) ? '❤️' : '🤍'}
              </button>
            </div>

            <div className="plant-meta">
              <span className="meta-item">
                <strong>Catégorie:</strong> {getCategoryInFrench(plant.category)}
              </span>
              <span className="meta-item">
                <strong>Taille:</strong> {getSizeInFrench(plant.size)}
              </span>
              <span className="meta-item">
                <strong>Stock:</strong> {plant.stock} disponible(s)
              </span>
            </div>

            <div className="price-section">
              {plant.onPromotion && plant.promotionPrice ? (
                <>
                  <span className="original-price">{plant.price.toFixed(2)} TND</span>
                  <span className="current-price promo">{displayPrice.toFixed(2)} TND</span>
                  <span className="save-amount">
                    Économisez {(plant.price - plant.promotionPrice).toFixed(2)} TND
                  </span>
                </>
              ) : (
                <span className="current-price">{displayPrice.toFixed(2)} TND</span>
              )}
            </div>

            <p className="plant-description">{plant.description}</p>

            {/* Care Instructions Section */}
            {plant.careInstructions && (
              <div className="care-instructions">
                <h3>🌿 Guide d'Entretien</h3>
                <div className="care-grid">
                  {plant.careInstructions.watering && (
                    <div className="care-item">
                      <div className="care-icon">💧</div>
                      <div className="care-content">
                        <h4>Arrosage</h4>
                        <p><strong>Fréquence:</strong> {plant.careInstructions.watering.frequency}</p>
                        <p><strong>Quantité:</strong> {plant.careInstructions.watering.amount}</p>
                      </div>
                    </div>
                  )}
                  
                  {plant.careInstructions.sunlight && (
                    <div className="care-item">
                      <div className="care-icon">☀️</div>
                      <div className="care-content">
                        <h4>Exposition</h4>
                        <p><strong>Type:</strong> {plant.careInstructions.sunlight.exposure}</p>
                        <p><strong>Durée:</strong> {plant.careInstructions.sunlight.duration}</p>
                      </div>
                    </div>
                  )}
                  
                  {plant.careInstructions.temperature && (
                    <div className="care-item">
                      <div className="care-icon">🌡️</div>
                      <div className="care-content">
                        <h4>Température</h4>
                        <p><strong>Idéale:</strong> {plant.careInstructions.temperature.ideal}</p>
                        <p><strong>Min-Max:</strong> {plant.careInstructions.temperature.min} - {plant.careInstructions.temperature.max}</p>
                      </div>
                    </div>
                  )}
                  
                  {plant.careInstructions.soil && (
                    <div className="care-item">
                      <div className="care-icon">🪴</div>
                      <div className="care-content">
                        <h4>Sol</h4>
                        <p>{plant.careInstructions.soil}</p>
                      </div>
                    </div>
                  )}
                  
                  {plant.careInstructions.fertilizer && (
                    <div className="care-item">
                      <div className="care-icon">🌱</div>
                      <div className="care-content">
                        <h4>Engrais</h4>
                        <p>{plant.careInstructions.fertilizer}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {plant.careInstructions.tips && plant.careInstructions.tips.length > 0 && (
                  <div className="care-tips">
                    <h4>💡 Conseils d'Expert</h4>
                    <ul>
                      {plant.careInstructions.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {plant.available && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Quantité:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(plant.stock, quantity + 1))}
                      disabled={quantity >= plant.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button className="btn btn-primary btn-large add-to-cart" onClick={handleAddToCart}>
                  🛒 Ajouter au panier - {(displayPrice * quantity).toFixed(2)} TND
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        {similarPlants.length > 0 && (
          <div className="similar-products">
            <h2>Produits Similaires</h2>
            <div className="products-grid">
              {similarPlants.map((similarPlant) => (
                <PlantCard key={similarPlant._id} plant={similarPlant} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div className="recently-viewed">
            <h2>Récemment Consultés</h2>
            <div className="products-grid">
              {recentlyViewed.map((viewedPlant) => (
                <PlantCard key={viewedPlant._id} plant={viewedPlant} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetails;
