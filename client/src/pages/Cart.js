import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCategoryInFrench } from '../utils/translations';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h2>Votre panier est vide</h2>
            <p>Découvrez nos plantes et commencez vos achats !</p>
            <button className="btn btn-primary" onClick={() => navigate('/plants')}>
              Voir le catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <div className="cart-header">
          <h1>Mon Panier</h1>
          <button className="btn btn-outline" onClick={clearCart}>
            Vider le panier
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => {
              const price = item.plant.onPromotion && item.plant.promotionPrice
                ? item.plant.promotionPrice
                : item.plant.price;

              return (
                <div key={item.plant._id} className="cart-item">
                  <div className="item-image">
                    {item.plant.images && item.plant.images.length > 0 ? (
                      <img src={item.plant.images[0]} alt={item.plant.name} />
                    ) : (
                      <div className="no-image">🌱</div>
                    )}
                  </div>

                  <div className="item-details">
                    <h3>{item.plant.name}</h3>
                    <p className="item-category">{getCategoryInFrench(item.plant.category)}</p>
                    {item.plant.onPromotion && item.plant.promotionPrice && (
                      <span className="promo-label">En promotion</span>
                    )}
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item.plant._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.plant._id, item.quantity + 1)}
                      disabled={item.quantity >= item.plant.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-price">
                    <span className="unit-price">{price.toFixed(2)} TND/unité</span>
                    <span className="total-price">{(price * item.quantity).toFixed(2)} TND</span>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.plant._id)}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Résumé</h2>
            
            <div className="summary-line">
              <span>Articles ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>{getCartTotal().toFixed(2)} TND</span>
            </div>

            <div className="summary-line total">
              <span>Total</span>
              <span>{getCartTotal().toFixed(2)} TND</span>
            </div>

            <button className="btn btn-primary btn-large checkout-button" onClick={handleCheckout}>
              Passer à la commande
            </button>

            <button
              className="btn btn-outline"
              onClick={() => navigate('/plants')}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Continuer les achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
