import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import './PoolifyDashboard.css';

// Client brand colors
const clientColors = {
  'Blinkit': { bg: '#ffe900', text: '#1a1a1a', border: '#ffd000' },
  'Swiggy': { bg: '#fc8019', text: '#ffffff', border: '#e07000' },
  'Zomato': { bg: '#e23744', text: '#ffffff', border: '#cb2f3c' },
  'Dunzo': { bg: '#00d290', text: '#ffffff', border: '#00b87d' }
};

function PoolifyDashboard() {
  const navigate = useNavigate();
  const { deliveryBoys, tasks, assignBestDeliveryBoy } = useData();
  const [notification, setNotification] = useState(null);

  const handleAssignment = (task) => {
    const result = assignBestDeliveryBoy(task);
    setNotification(result);
    setTimeout(() => setNotification(null), 4000);
  };

  // Filter tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'PENDING');
  const assignedTasks = tasks.filter(task => task.status === 'ASSIGNED' || task.status === 'IN_PROGRESS');

  return (
    <div className="poolify-dashboard">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.success ? 'success' : 'error'}`}>
          {notification.success ? '✅' : '❌'} {notification.message}
        </div>
      )}

      <header className="dashboard-header">
        <div className="header-nav">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
        <h1>🚚 Poolify Admin Dashboard</h1>
        <p className="tagline">Intelligent Delivery Assignment System</p>
      </header>

      <div className="dashboard-content">
        {/* Pending Tasks Panel */}
        <section className="panel pending-tasks-panel">
          <h2>📦 Pending Tasks</h2>
          <p className="panel-description">Click &quot;Run Assignment&quot; to assign a delivery boy</p>
          
          {pendingTasks.length === 0 ? (
            <div className="empty-state">
              <p>✨ No pending tasks! All tasks have been assigned.</p>
            </div>
          ) : (
            <div className="task-list">
              {pendingTasks.map(task => {
                const clientStyle = clientColors[task.client_name] || { bg: '#e9ecef', text: '#333', border: '#ccc' };
                return (
                  <div 
                    key={task.request_id} 
                    className="task-card pending"
                    style={{ borderLeftColor: clientStyle.border }}
                  >
                    <span className="request-id-badge">#{task.request_id}</span>
                    <div className="task-info">
                      <div className="task-header">
                        <span 
                          className="client-badge"
                          style={{ background: clientStyle.bg, color: clientStyle.text }}
                        >
                          {task.client_name}
                        </span>
                        <span className="customer-name">👤 {task.customer_name}</span>
                      </div>
                      <div className="task-details">
                        <div className="location">
                          <span className="label">📦 Pickup:</span>
                          <span className="value">{task.pickup_society}</span>
                        </div>
                        <span className="arrow">→</span>
                        <div className="location">
                          <span className="label">📍 Dropoff:</span>
                          <span className="value">{task.dropoff_society}</span>
                        </div>
                      </div>
                      <div className="order-value">
                        <span className="rupee">₹{task.order_value}</span>
                      </div>
                    </div>
                    <button 
                      className="assign-btn"
                      onClick={() => handleAssignment(task)}
                    >
                      Run Assignment
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show assigned tasks */}
          {assignedTasks.length > 0 && (
            <>
              <h3 className="assigned-header">✅ Active Tasks</h3>
              <div className="task-list assigned-list">
                {assignedTasks.map(task => {
                  const clientStyle = clientColors[task.client_name] || { bg: '#e9ecef', text: '#333', border: '#28a745' };
                  const assignedDb = deliveryBoys.find(db => db.db_id === task.assigned_to);
                  return (
                    <div 
                      key={task.request_id} 
                      className="task-card assigned"
                      style={{ borderLeftColor: '#28a745' }}
                    >
                      <span className="request-id-badge">#{task.request_id}</span>
                      <div className="task-info">
                        <div className="task-header">
                          <span 
                            className="client-badge"
                            style={{ background: clientStyle.bg, color: clientStyle.text }}
                          >
                            {task.client_name}
                          </span>
                          <span className={`status-badge ${task.status.toLowerCase()}`}>
                            {task.status === 'IN_PROGRESS' ? '🚀 IN PROGRESS' : '✅ ASSIGNED'}
                          </span>
                        </div>
                        <div className="task-details">
                          <div className="location">
                            <span className="label">📦 Pickup:</span>
                            <span className="value">{task.pickup_society}</span>
                          </div>
                          <span className="arrow">→</span>
                          <div className="location">
                            <span className="label">📍 Dropoff:</span>
                            <span className="value">{task.dropoff_society}</span>
                          </div>
                        </div>
                        {assignedDb && (
                          <div className="assigned-to-info">
                            <span className="label">🏍️ Assigned to:</span>
                            <span className="value">{assignedDb.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* Delivery Boy Status Panel */}
        <section className="panel delivery-boys-panel">
          <h2>🏍️ Delivery Personnel</h2>
          <p className="panel-description">Real-time status of all delivery personnel</p>
          
          <div className="delivery-boy-list">
            {deliveryBoys.map(db => (
              <Link 
                key={db.db_id} 
                to={`/partner/${db.db_id}`}
                className={`delivery-boy-card ${db.is_available ? 'available' : 'busy'}`}
              >
                <div className="db-avatar">👤</div>
                <div className="db-info">
                  <div className="db-main-info">
                    <div className="db-name">{db.name}</div>
                    <span className={`availability-badge ${db.is_available ? 'available' : 'busy'}`}>
                      {db.is_available ? '✅ Available' : '🔴 Busy'}
                    </span>
                  </div>
                  <div className="db-details">
                    <div className="db-location">
                      <span className="label">📍</span>
                      <span className="value">{db.current_society}</span>
                    </div>
                    {db.assigned_request_id && (
                      <div className="db-assignment">
                        <span className="label">📋 Task:</span>
                        <span className="value">#{db.assigned_request_id}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="view-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer className="dashboard-footer">
        <p>Poolify PoC - Intelligent Delivery Assignment System</p>
        <p className="hint">💡 Open browser console to see assignment logic details</p>
      </footer>
    </div>
  );
}

export default PoolifyDashboard;
