import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import { getCategoryInFrench } from '../../utils/translations';
import './Plants.css';

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'indoor',
    size: 'medium',
    stock: '',
    featured: false,
    onPromotion: false,
    promotionPrice: ''
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [generatingAI, setGeneratingAI] = useState(false);
  const [priceRecommendation, setPriceRecommendation] = useState(null);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const { data } = await API.get('/plants');
      setPlants(data.data);
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const generateAIInfo = async () => {
    if (!formData.name || !formData.category || !formData.size) {
      setMessage({ 
        type: 'error', 
        text: 'Veuillez remplir le nom, la catégorie et la taille avant de générer' 
      });
      return;
    }

    setGeneratingAI(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await API.post('/admin/plants/generate-info', {
        plantName: formData.name,
        category: formData.category,
        size: formData.size
      });

      // Update description
      setFormData({
        ...formData,
        description: data.data.description,
        price: data.data.priceRecommendation.recommendedPrice,
        careInstructions: data.data.careInstructions
      });

      // Store price recommendation for display
      setPriceRecommendation(data.data.priceRecommendation);

      setMessage({ 
        type: 'success', 
        text: '✨ Description, prix et guide d\'entretien générés avec succès!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erreur lors de la génération' 
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      images.forEach((file) => {
        data.append('images', file);
      });

      if (editingPlant) {
        await API.put(`/admin/plants/${editingPlant._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ type: 'success', text: 'Plante mise à jour!' });
      } else {
        await API.post('/admin/plants', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ type: 'success', text: 'Plante ajoutée!' });
      }

      fetchPlants();
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur' });
    }
  };

  const handleEdit = (plant) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      description: plant.description,
      price: plant.price,
      category: plant.category,
      size: plant.size,
      stock: plant.stock,
      featured: plant.featured,
      onPromotion: plant.onPromotion,
      promotionPrice: plant.promotionPrice || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette plante?')) return;

    try {
      await API.delete(`/admin/plants/${id}`);
      setMessage({ type: 'success', text: 'Plante supprimée!' });
      fetchPlants();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'indoor',
      size: 'medium',
      stock: '',
      featured: false,
      onPromotion: false,
      promotionPrice: ''
    });
    setImages([]);
    setEditingPlant(null);
    setShowModal(false);
    setPriceRecommendation(null);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-plants">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gestion des Plantes</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Ajouter une plante
          </button>
        </div>

        {message.text && (
          <div className={`alert ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="plants-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plants.map((plant) => (
                <tr key={plant._id}>
                  <td>
                    {plant.images && plant.images[0] ? (
                      <img src={plant.images[0]} alt={plant.name} className="plant-thumb" />
                    ) : (
                      <div className="no-thumb">🌱</div>
                    )}
                  </td>
                  <td>
                    <strong>{plant.name}</strong>
                    {plant.featured && <span className="badge">⭐ Vedette</span>}
                    {plant.onPromotion && <span className="badge promo">🏷️ Promo</span>}
                  </td>
                  <td>{getCategoryInFrench(plant.category)}</td>
                  <td className="price">{plant.price.toFixed(2)} TND</td>
                  <td>
                    <span className={plant.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                      {plant.stock}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => handleEdit(plant)} title="Modifier">
                      ✏️
                    </button>
                    <button className="btn-icon" onClick={() => handleDelete(plant._id)} title="Supprimer">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingPlant ? 'Modifier la plante' : 'Ajouter une plante'}</h2>
              
              {!editingPlant && (
                <div className="ai-helper">
                  <p className="ai-helper-text">
                    💡 Remplissez le nom, catégorie et taille, puis utilisez l'IA pour générer la description et le prix automatiquement!
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-ai" 
                    onClick={generateAIInfo}
                    disabled={generatingAI || !formData.name || !formData.category || !formData.size}
                  >
                    {generatingAI ? '⏳ Génération en cours...' : '✨ Générer avec l\'IA'}
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                    placeholder={generatingAI ? "Génération de la description..." : "Description de la plante"}
                  />
                </div>

                {priceRecommendation && (
                  <div className="price-recommendation">
                    <p><strong>💰 Recommandation de prix:</strong></p>
                    <p>Prix suggéré: <strong>{priceRecommendation.recommendedPrice} TND</strong></p>
                    <p>Fourchette: {priceRecommendation.minPrice} - {priceRecommendation.maxPrice} TND</p>
                    <p className="explanation">{priceRecommendation.explanation}</p>
                  </div>
                )}

                {formData.careInstructions && (
                  <div className="care-preview">
                    <p><strong>🌿 Guide d'entretien généré:</strong></p>
                    <div className="care-preview-grid">
                      {formData.careInstructions.watering && (
                        <div className="care-preview-item">
                          <strong>💧 Arrosage:</strong> {formData.careInstructions.watering.frequency}
                        </div>
                      )}
                      {formData.careInstructions.sunlight && (
                        <div className="care-preview-item">
                          <strong>☀️ Exposition:</strong> {formData.careInstructions.sunlight.exposure}
                        </div>
                      )}
                      {formData.careInstructions.temperature && (
                        <div className="care-preview-item">
                          <strong>🌡️ Température:</strong> {formData.careInstructions.temperature.ideal}
                        </div>
                      )}
                      {formData.careInstructions.soil && (
                        <div className="care-preview-item">
                          <strong>🪴 Sol:</strong> {formData.careInstructions.soil}
                        </div>
                      )}
                    </div>
                    <p className="care-note">✅ Le guide d'entretien sera automatiquement sauvegardé avec la plante</p>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Prix (TND) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                      placeholder={priceRecommendation ? `Suggéré: ${priceRecommendation.recommendedPrice}` : "Prix en dinars"}
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Catégorie *</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      <option value="indoor">Intérieur</option>
                      <option value="outdoor">Extérieur</option>
                      <option value="succulent">Succulente</option>
                      <option value="flower">Fleur</option>
                      <option value="tree">Arbre</option>
                      <option value="herb">Herbe</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Taille *</label>
                    <select name="size" value={formData.size} onChange={handleInputChange}>
                      <option value="small">Petite</option>
                      <option value="medium">Moyenne</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    Plante vedette
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"TND
                      name="onPromotion"
                      checked={formData.onPromotion}
                      onChange={handleInputChange}
                    />
                    En promotion
                  </label>
                </div>

                {formData.onPromotion && (
                  <div className="form-group">
                    <label>Prix promotionnel (€)</label>
                    <input
                      type="number"
                      name="promotionPrice"
                      value={formData.promotionPrice}
                      onChange={handleInputChange}
                      step="0.01"
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingPlant ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={resetForm}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plants;
