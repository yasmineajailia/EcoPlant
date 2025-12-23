import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>Commande non trouvée</h2>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="container">
        <div className="success-message-box">
          <div className="success-icon">✓</div>
          <h1>Commande confirmée !</h1>
          <p>Merci pour votre commande. Nous avons bien reçu votre demande.</p>
          <p className="order-number">Numéro de commande: <strong>{order._id}</strong></p>
        </div>

        <div className="order-details-card">
          <h2>Détails de la commande</h2>

          <div className="order-items">
            <h3>Articles commandés</h3>
            {order.orderItems.map((item) => (
              <div key={item._id} className="order-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="no-image">🌱</div>
                  )}
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantité: {item.quantity}</p>
                </div>
                <div className="item-price">
                  {(item.price * item.quantity).toFixed(2)} TND
                </div>
              </div>
            ))}
          </div>

          <div className="delivery-info">
            {order.deliveryInfo.email && (
              <p><strong>Email:</strong> {order.deliveryInfo.email}</p>
            )}
            <h3>Informations de livraison</h3>
            <p><strong>Nom:</strong> {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</p>
            <p><strong>Téléphone:</strong> {order.deliveryInfo.phone}</p>
            <p><strong>Adresse:</strong></p>
            <address>
              {order.deliveryInfo.address.street}<br />
              {order.deliveryInfo.address.postalCode} {order.deliveryInfo.address.city}<br />
              {order.deliveryInfo.address.country}
            </address>
          </div>

          <div className="order-summary">
            <div className="summary-line">
              <span>Statut:</span>
              <span className={`status ${order.orderStatus}`}>
                {order.orderStatus === 'pending' ? 'En attente' :
                 order.orderStatus === 'preparing' ? 'En préparation' :
                 order.orderStatus === 'shipped' ? 'Expédiée' :
                 order.orderStatus === 'delivered' ? 'Livrée' : 'Annulée'}
              </span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>{order.totalPrice.toFixed(2)} TND</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          {user ? (
            <Link to="/orders" className="btn btn-primary">
              Voir mes commandes
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary">
              Créer un compte
            </Link>
          )}
          <Link to="/plants" className="btn btn-outline">
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
