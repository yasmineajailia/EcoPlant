import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/admin/orders');
      setOrders(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, {
        orderStatus: newStatus
      });
      setMessage({ type: 'success', text: 'Statut mis à jour!' });
      fetchOrders();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  const updateDeliveryStatus = async (orderId, deliveryData) => {
    try {
      await API.put(`/admin/orders/${orderId}/delivery`, deliveryData);
      setMessage({ type: 'success', text: 'Livraison mise à jour!' });
      fetchOrders();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
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

  return (
    <div className="admin-orders">
      <div className="container">
        <h1 className="page-title">Gestion des Commandes</h1>

        {message.text && (
          <div className={`alert ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Commande #{order._id.slice(-8)}</h3>
                  <p className="order-info">
                    Client: {order.user?.firstName} {order.user?.lastName}<br />
                    Email: {order.user?.email}<br />
                    Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="order-status-section">
                  <label>Statut de la commande:</label>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className={`status-select ${order.orderStatus}`}
                  >
                    <option value="pending">En attente</option>
                    <option value="preparing">En préparation</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>
              </div>

              <div className="order-items">
                <h4>Articles:</h4>
                {order.orderItems.map((item) => (
                  <div key={item._id} className="order-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="item-price">{(item.price * item.quantity).toFixed(2)} TND</span>
                  </div>
                ))}
                <div className="order-total">
                  <strong>Total:</strong>
                  <strong className="total-price">{order.totalPrice.toFixed(2)} TND</strong>
                </div>
              </div>

              <div className="delivery-info">
                <h4>Informations de livraison:</h4>
                <p>
                  <strong>Nom:</strong> {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}<br />
                  <strong>Téléphone:</strong> {order.deliveryInfo.phone}<br />
                  <strong>Adresse:</strong> {order.deliveryInfo.address.street}, {order.deliveryInfo.address.postalCode} {order.deliveryInfo.address.city}
                </p>

                <div className="delivery-controls">
                  <div className="form-group">
                    <label>Statut de livraison:</label>
                    <select
                      value={order.deliveryStatus}
                      onChange={(e) =>
                        updateDeliveryStatus(order._id, { deliveryStatus: e.target.value })
                      }
                      className="delivery-select"
                    >
                      <option value="not-assigned">Non assignée</option>
                      <option value="assigned">Assignée</option>
                      <option value="in-transit">En transit</option>
                      <option value="delivered">Livrée</option>
                    </select>
                  </div>

                  {order.deliveryDriver && (
                    <div className="delivery-driver">
                      <strong>Livreur:</strong> {order.deliveryDriver}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="no-orders">
              <p>Aucune commande pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
