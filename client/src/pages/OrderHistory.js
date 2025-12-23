import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my-orders');
      setOrders(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      preparing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>Aucune commande</h2>
            <p>Vous n'avez pas encore passé de commande.</p>
            <Link to="/plants" className="btn btn-primary">
              Découvrir nos plantes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="container">
        <h1 className="page-title">Mes Commandes</h1>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Commande #{order._id.slice(-8)}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`status-badge ${order.orderStatus}`}>
                  {getStatusLabel(order.orderStatus)}
                </span>
              </div>

              <div className="order-items">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="order-item">
                    <div className="item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="no-image">🌱</div>
                      )}
                    </div>
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Quantité: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">{order.totalPrice.toFixed(2)} TND</span>
                </div>
                <Link to={`/order-confirmation/${order._id}`} className="btn btn-outline">
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
