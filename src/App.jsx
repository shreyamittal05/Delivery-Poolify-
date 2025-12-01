import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import LandingPage from './components/LandingPage';
import PoolifyDashboard from './components/PoolifyDashboard';
import DeliveryPartnerView from './components/DeliveryPartnerView';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<PoolifyDashboard />} />
          <Route path="/partner/:db_id" element={<DeliveryPartnerView />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
