import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EcoPlant</h3>
            <p>Votre boutique en ligne de plantes de qualité</p>
          </div>
          
          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/plants">Catalogue</a></li>
              <li><a href="/cart">Panier</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: contact@pepiniere.com</p>
            <p>Tél: +216 25 588 988</p>
          </div>
          
          <div className="footer-section">
            <h4>Horaires</h4>
            <p>Lundi - Vendredi: 9h - 18h</p>
            <p>Samedi: 9h - 17h</p>
            <p>Dimanche: Fermé</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EcoPlant. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
