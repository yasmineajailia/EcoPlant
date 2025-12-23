import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await API.get('/admin/dashboard');
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
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

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="page-title">Tableau de Bord Admin</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Total Commandes</h3>
              <p className="stat-number">{stats?.totalOrders || 0}</p>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>En Attente</h3>
              <p className="stat-number">{stats?.pendingOrders || 0}</p>
            </div>
          </div>

          <div className="stat-card delivered">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <h3>Livrées</h3>
              <p className="stat-number">{stats?.deliveredOrders || 0}</p>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Revenu Total</h3>
              <p className="stat-number">{stats?.totalRevenue?.toFixed(2) || 0} TND</p>
            </div>
          </div>
        </div>

        <div className="recent-orders">
          <h2>Commandes Récentes</h2>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Articles</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8)}</td>
                    <td>
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td>{order.orderItems.length}</td>
                    <td className="price">{order.totalPrice.toFixed(2)} TND</td>
                    <td>
                      <span className={`status-badge ${order.orderStatus}`}>
                        {order.orderStatus === 'pending' ? 'En attente' :
                         order.orderStatus === 'preparing' ? 'En préparation' :
                         order.orderStatus === 'shipped' ? 'Expédiée' :
                         order.orderStatus === 'delivered' ? 'Livrée' : 'Annulée'}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="actions-grid">
            <a href="/admin/plants" className="action-card">
              <div className="action-icon">🌱</div>
              <h3>Gérer les Plantes</h3>
              <p>Ajouter, modifier ou supprimer des plantes</p>
            </a>
            <a href="/admin/orders" className="action-card">
              <div className="action-icon">📦</div>
              <h3>Gérer les Commandes</h3>
              <p>Voir et mettre à jour les commandes</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
