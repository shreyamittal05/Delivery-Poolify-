import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const { deliveryBoys } = useData();
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');
  const [showDeliverySelect, setShowDeliverySelect] = useState(false);

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleDeliveryPartnerClick = () => {
    setShowDeliverySelect(true);
  };

  const handleDeliveryBoySelect = (e) => {
    setSelectedDeliveryBoy(e.target.value);
  };

  const handleDeliveryLogin = () => {
    if (selectedDeliveryBoy) {
      navigate(`/partner/${selectedDeliveryBoy}`);
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Header/Branding */}
        <header className="landing-header">
          <div className="logo">
            <span className="logo-icon">🚚</span>
            <h1>Poolify</h1>
          </div>
          <p className="tagline">Intelligent Delivery Assignment System</p>
        </header>

        {/* Role Selection Cards */}
        <div className="role-selection">
          <h2>Choose Your Role</h2>
          
          <div className="role-cards">
            {/* Admin Card */}
            <div className="role-card admin-card" onClick={handleAdminClick}>
              <div className="card-icon">🛠️</div>
              <h3>Admin Dashboard</h3>
              <p>Manage delivery assignments, view all tasks and delivery personnel status</p>
              <button className="role-btn admin-btn">Enter as Admin</button>
            </div>

            {/* Delivery Partner Card */}
            <div className="role-card partner-card">
              <div className="card-icon">🏍️</div>
              <h3>Delivery Partner</h3>
              <p>View your assigned tasks, start deliveries, and update delivery status</p>
              
              {!showDeliverySelect ? (
                <button 
                  className="role-btn partner-btn" 
                  onClick={handleDeliveryPartnerClick}
                >
                  Login as Partner
                </button>
              ) : (
                <div className="delivery-select-container">
                  <select 
                    value={selectedDeliveryBoy} 
                    onChange={handleDeliveryBoySelect}
                    className="delivery-select"
                  >
                    <option value="">Select your name...</option>
                    {deliveryBoys.map(db => (
                      <option key={db.db_id} value={db.db_id}>
                        {db.name} ({db.current_society})
                      </option>
                    ))}
                  </select>
                  <button 
                    className="role-btn login-btn"
                    onClick={handleDeliveryLogin}
                    disabled={!selectedDeliveryBoy}
                  >
                    Continue →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="landing-footer">
         
          <p className="version">Poolify PoC v1.0</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
