import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import PlantCard from '../components/PlantCard';
import './Home.css';

const Home = () => {
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [promotionalPlants, setPromotionalPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const [featured, promos] = await Promise.all([
        API.get('/plants/featured'),
        API.get('/plants/promotions')
      ]);
      
      setFeaturedPlants(featured.data.data);
      setPromotionalPlants(promos.data.data);
    } catch (error) {
      console.error('Error fetching plants:', error);
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
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Bienvenue chez EcoPlant</h1>
            <p>Découvrez notre sélection de plantes pour embellir votre intérieur et extérieur</p>
            <Link to="/plants" className="btn btn-primary btn-large">
              Voir le Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Plants */}
      {promotionalPlants.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>🏷️ Promotions en cours</h2>
              <Link to="/plants?promo=true" className="view-all">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-4">
              {promotionalPlants.slice(0, 4).map((plant) => (
                <PlantCard key={plant._id} plant={plant} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Plants */}
      {featuredPlants.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>⭐ Plantes vedettes</h2>
              <Link to="/plants" className="view-all">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-4">
              {featuredPlants.slice(0, 4).map((plant) => (
                <PlantCard key={plant._id} plant={plant} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Livraison Rapide</h3>
              <p>Recevez vos plantes directement chez vous</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Qualité Garantie</h3>
              <p>Plantes saines et bien entretenues</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💚</div>
              <h3>Conseils d'Expert</h3>
              <p>Guide d'entretien pour chaque plante</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
