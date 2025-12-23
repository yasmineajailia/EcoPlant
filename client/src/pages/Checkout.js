import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [deliveryInfo, setDeliveryInfo] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'Tunisia'
  });

  const handleChange = (e) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        orderItems: cart.map((item) => ({
          plant: item.plant._id,
          quantity: item.quantity
        })),
        deliveryInfo: {
          email: deliveryInfo.email,
          firstName: deliveryInfo.firstName,
          lastName: deliveryInfo.lastName,
          phone: deliveryInfo.phone,
          address: {
            street: deliveryInfo.street,
            city: deliveryInfo.city,
            postalCode: deliveryInfo.postalCode,
            country: deliveryInfo.country
          }
        },
        isGuestOrder: !user
      };

      const { data } = await API.post('/orders', orderData);
      
      clearCart();
      navigate(`/order-confirmation/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout">
      <div className="container">
        <h1 className="page-title">Finaliser la commande</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {!user && (
              <div className="guest-notice">
                <p>Vous passez commande en tant qu'invité.</p>
                <p>
                  <a href="/login" className="login-link">Se connecter</a> ou{' '}
                  <a href="/register" className="login-link">créer un compte</a> pour suivre vos commandes.
                </p>
              </div>
            )}

            <section className="form-section">
              <h2>Informations de livraison</h2>

              {!user && (
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={deliveryInfo.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                  />
                  <small>Vous recevrez la confirmation de commande à cette adresse</small>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={deliveryInfo.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={deliveryInfo.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={deliveryInfo.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Adresse *</label>
                <input
                  type="text"
                  name="street"
                  value={deliveryInfo.street}
                  onChange={handleChange}
                  placeholder="Numéro et nom de rue"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ville *</label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Code postal *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={deliveryInfo.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pays *</label>
                <input
                  type="text"
                  name="country"
                  value={deliveryInfo.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </section>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-large submit-button"
              disabled={loading}
            >
              {loading ? 'Traitement...' : 'Confirmer la commande'}
            </button>
          </form>

          <div className="order-summary">
            <h2>Résumé de la commande</h2>

            <div className="summary-items">
              {cart.map((item) => {
                const price = item.plant.onPromotion && item.plant.promotionPrice
                  ? item.plant.promotionPrice
                  : item.plant.price;

                return (
                  <div key={item.plant._id} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{item.plant.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                    <span className="item-total">{(price * item.quantity).toFixed(2)} TND</span>
                  </div>
                );
              })}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">{getCartTotal().toFixed(2)} TND</span>
            </div>

            <div className="delivery-note">
              <p>📦 Livraison gratuite</p>
              <p>⏱️ Délai de livraison: 3-5 jours ouvrables</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
