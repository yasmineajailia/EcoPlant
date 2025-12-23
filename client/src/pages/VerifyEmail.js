import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import './Login.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const { data } = await API.get(`/users/verify-email/${token}`);
      
      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          {status === 'loading' && (
            <>
              <div className="spinner" style={{ margin: '2rem auto' }}></div>
              <h2>Vérification en cours...</h2>
              <p>Veuillez patienter pendant que nous vérifions votre email.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ color: 'var(--primary-color)' }}>Email vérifié !</h2>
              <p style={{ fontSize: '1.1rem', margin: '1.5rem 0' }}>{message}</p>
              <p style={{ color: '#666' }}>
                Vous allez être redirigé vers la page de connexion dans quelques secondes...
              </p>
              <Link to="/login" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                Se connecter maintenant
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
              <h2 style={{ color: '#e74c3c' }}>Vérification échouée</h2>
              <p style={{ fontSize: '1.1rem', margin: '1.5rem 0' }}>{message}</p>
              <div style={{ marginTop: '2rem' }}>
                <Link to="/login" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                  Retour à la connexion
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Créer un nouveau compte
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
