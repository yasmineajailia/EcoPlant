import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlantCatalog from './pages/PlantCatalog';
import PlantDetails from './pages/PlantDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPlants from './pages/admin/Plants';
import AdminOrders from './pages/admin/Orders';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { WishlistProvider } from './context/WishlistContext';
import './App.css';

function App() {
  return (
    <WishlistProvider>
      <Router>
        <div className="App">
          <Header />
          <CategoryFilter />
            <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
            <Route path="/plants" element={<PlantCatalog />} />
            <Route path="/plants/:id" element={<PlantDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute>
                <OrderHistory />
              </PrivateRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/plants" element={
              <AdminRoute>
                <AdminPlants />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </WishlistProvider>
  );
}

export default App;
