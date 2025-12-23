import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src="/2aa67659ee571ad3fa9550681bf8acbe-removebg-preview.png" alt="Pépinière Logo" className="logo-image" />
          <h1>EcoPlant</h1>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/plants" className="nav-link">Catalogue</Link>
          
          {user ? (
            <>
              <Link to="/orders" className="nav-link">Mes Commandes</Link>
              {isAdmin() && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
              <Link to="/profile" className="nav-link">Profil</Link>
              <button onClick={logout} className="nav-link btn-link">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Connexion</Link>
              <Link to="/register" className="nav-link">Inscription</Link>
            </>
          )}
          
          <Link to="/cart" className="cart-link">
            🛒 Panier
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
