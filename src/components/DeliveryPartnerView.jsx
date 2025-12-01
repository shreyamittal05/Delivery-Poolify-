import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import './DeliveryPartnerView.css';

// Client brand colors
const clientColors = {
  'Blinkit': { bg: '#ffe900', text: '#1a1a1a', border: '#ffd000' },
  'Swiggy': { bg: '#fc8019', text: '#ffffff', border: '#e07000' },
  'Zomato': { bg: '#e23744', text: '#ffffff', border: '#cb2f3c' },
  'Dunzo': { bg: '#00d290', text: '#ffffff', border: '#00b87d' }
};

// Mock phone numbers for customers
const mockPhoneNumbers = {
  'Rohit Sharma': '+91 98765 43210',
  'Anjali Mehta': '+91 87654 32109',
  'Karan Singh': '+91 76543 21098',
  'Neha Kapoor': '+91 65432 10987',
  'Sanjay Gupta': '+91 54321 09876'
};

function DeliveryPartnerView() {
  const { db_id } = useParams();
  const navigate = useNavigate();
  const { 
    getDeliveryBoyById, 
    getTasksForDeliveryBoy, 
    startDelivery, 
    completeDelivery,
    tasks 
  } = useData();

  const [notification, setNotification] = useState(null);

  const deliveryBoy = getDeliveryBoyById(db_id);
  const assignedTasks = getTasksForDeliveryBoy(db_id);
  const activeTask = assignedTasks.find(t => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED' && t.assigned_to === parseInt(db_id));

  if (!deliveryBoy) {
    return (
      <div className="partner-view">
        <div className="partner-container">
          <div className="error-state">
            <h2>❌ Delivery Partner Not Found</h2>
            <p>The requested delivery partner does not exist.</p>
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartDelivery = (taskId) => {
    const result = startDelivery(taskId);
    setNotification(result);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCompleteDelivery = (taskId) => {
    const result = completeDelivery(taskId, parseInt(db_id));
    setNotification(result);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="partner-view">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.success ? 'success' : 'error'}`}>
          {notification.success ? '✅' : '❌'} {notification.message}
        </div>
      )}

      <div className="partner-container">
        {/* Header */}
        <header className="partner-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          
          <div className="welcome-section">
            <div className="avatar-large">👤</div>
            <div className="welcome-text">
              <h1>Welcome, {deliveryBoy.name}!</h1>
              <div className="status-info">
                <span className="location-badge">
                  📍 {deliveryBoy.current_society}
                </span>
                <span className={`status-badge ${deliveryBoy.is_available ? 'available' : 'busy'}`}>
                  {deliveryBoy.is_available ? '✅ Available' : '🔴 Busy'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="partner-content">
          {/* Active Task Section */}
          <section className="section active-task-section">
            <h2>📦 My Active Delivery</h2>
            
            {activeTask ? (
              <div className="active-task-card">
                <div className="task-badge-container">
                  <span className="task-id-badge">Order #{activeTask.request_id}</span>
                  <span 
                    className="client-badge"
                    style={{ 
                      background: clientColors[activeTask.client_name]?.bg || '#e9ecef',
                      color: clientColors[activeTask.client_name]?.text || '#333'
                    }}
                  >
                    {activeTask.client_name}
                  </span>
                </div>

                <div className="customer-info">
                  <h3>👤 Customer Details</h3>
                  <div className="info-row">
                    <span className="label">Name:</span>
                    <span className="value">{activeTask.customer_name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value phone">{mockPhoneNumbers[activeTask.customer_name] || '+91 99999 99999'}</span>
                  </div>
                </div>

                <div className="route-info">
                  <div className="route-point pickup">
                    <div className="route-icon">📦</div>
                    <div className="route-details">
                      <span className="route-label">Pickup Location</span>
                      <span className="route-value">{activeTask.pickup_society}</span>
                    </div>
                  </div>
                  <div className="route-connector">
                    <div className="connector-line"></div>
                    <span className="connector-arrow">↓</span>
                  </div>
                  <div className="route-point dropoff">
                    <div className="route-icon">📍</div>
                    <div className="route-details">
                      <span className="route-label">Dropoff Location</span>
                      <span className="route-value">{activeTask.dropoff_society}</span>
                    </div>
                  </div>
                </div>

                <div className="order-info">
                  <div className="order-value">
                    <span className="label">Order Value:</span>
                    <span className="value">₹{activeTask.order_value}</span>
                  </div>
                  <div className="task-status">
                    <span className="label">Status:</span>
                    <span className={`status-pill ${activeTask.status.toLowerCase().replace('_', '-')}`}>
                      {activeTask.status === 'ASSIGNED' && '📋 Assigned'}
                      {activeTask.status === 'IN_PROGRESS' && '🚀 In Progress'}
                    </span>
                  </div>
                </div>

                <div className="action-buttons">
                  {activeTask.status === 'ASSIGNED' && (
                    <button 
                      className="action-btn start-btn"
                      onClick={() => handleStartDelivery(activeTask.request_id)}
                    >
                      🚀 Start Delivery
                    </button>
                  )}
                  {activeTask.status === 'IN_PROGRESS' && (
                    <button 
                      className="action-btn complete-btn"
                      onClick={() => handleCompleteDelivery(activeTask.request_id)}
                    >
                      ✅ Complete Delivery
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <h3>No Active Deliveries</h3>
                <p>You&apos;re available for new tasks! Check with admin for new assignments.</p>
                <div className="availability-status">
                  <span className={`status-indicator ${deliveryBoy.is_available ? 'available' : 'busy'}`}></span>
                  <span>Status: {deliveryBoy.is_available ? 'Available' : 'Busy'}</span>
                </div>
              </div>
            )}
          </section>

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <section className="section completed-section">
              <h2>✅ Completed Deliveries</h2>
              <div className="completed-list">
                {completedTasks.map(task => (
                  <div key={task.request_id} className="completed-card">
                    <div className="completed-header">
                      <span className="task-id">#{task.request_id}</span>
                      <span 
                        className="client-tag"
                        style={{ 
                          background: clientColors[task.client_name]?.bg || '#e9ecef',
                          color: clientColors[task.client_name]?.text || '#333'
                        }}
                      >
                        {task.client_name}
                      </span>
                      <span className="completed-badge">✅ Completed</span>
                    </div>
                    <div className="completed-details">
                      <span>{task.pickup_society} → {task.dropoff_society}</span>
                      <span className="completed-value">₹{task.order_value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="partner-footer">
          <p>Poolify Delivery Partner App</p>
          <p className="hint">💡 Complete deliveries to become available for new tasks</p>
        </footer>
      </div>
    </div>
  );
}

export default DeliveryPartnerView;
