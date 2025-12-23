import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import PlantCard from '../components/PlantCard';
import './PlantCatalog.css';

const PlantCatalog = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      size: searchParams.get('size') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || ''
    });
  }, [searchParams]);

  useEffect(() => {
    fetchPlants();
  }, [searchParams]);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(searchParams);
      const { data } = await API.get(`/plants?${queryParams.toString()}`);
      setPlants(data.data);
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setSearchParams(params);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      size: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="catalog">
      <div className="container">
        <h1 className="page-title">Catalogue de Plantes</h1>

        <div className="catalog-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <h2>Filtres</h2>

            <div className="filter-group">
              <label>Rechercher</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nom de la plante..."
              />
            </div>

            <div className="filter-group">
              <label>Catégorie</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">Toutes</option>
                <option value="indoor">Intérieur</option>
                <option value="outdoor">Extérieur</option>
                <option value="succulent">Succulente</option>
                <option value="flower">Fleur</option>
                <option value="tree">Arbre</option>
                <option value="herb">Herbe</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Taille</label>
              <select name="size" value={filters.size} onChange={handleFilterChange}>
                <option value="">Toutes</option>
                <option value="small">Petite</option>
                <option value="medium">Moyenne</option>
                <option value="large">Grande</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Prix minimum (TND)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="filter-group">
              <label>Prix maximum (TND)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="1000"
                min="0"
              />
            </div>

            <div className="filter-actions">
              <button className="btn btn-primary" onClick={applyFilters}>
                Appliquer
              </button>
              <button className="btn btn-outline" onClick={resetFilters}>
                Réinitialiser
              </button>
            </div>
          </aside>

          {/* Plants Grid */}
          <div className="catalog-content">
            <div className="catalog-header">
              <p className="results-count">{plants.length} plante(s) trouvée(s)</p>
            </div>

            {plants.length === 0 ? (
              <div className="no-results">
                <p>Aucune plante trouvée avec ces critères.</p>
                <button className="btn btn-primary" onClick={resetFilters}>
                  Voir toutes les plantes
                </button>
              </div>
            ) : (
              <div className="grid grid-3">
                {plants.map((plant) => (
                  <PlantCard key={plant._id} plant={plant} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCatalog;
