import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar: React.FC = () => {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav>
      <div className="nav-container">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/wallet">Wallet</Link></li>
          <li><Link to="/account">Account</Link></li>
        </ul>
        <div className="nav-auth">
          {(loading || user) ? (
            <div className="user-section">
              <span className="user-name" style={{ 
                minWidth: '100px',
                textAlign: 'center',
                display: 'inline-block'
              }}>
                {loading ? '' : user?.name}
              </span>
              <button 
                onClick={handleLogout} 
                className="logout-button"
                disabled={loading}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-button">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;