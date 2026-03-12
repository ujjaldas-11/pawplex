import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { DashboardWrapper } from './components/layout/DashboardWrapper';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Overview } from './pages/Overview';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';

// Vet Pages
import { Appointments } from './pages/vet/Appointments';
import { PatientHistory } from './pages/vet/PatientHistory';
import { ClinicSettings } from './pages/vet/ClinicSettings';

// Shelter Pages
import { Listings } from './pages/shelter/Listings';
import { AdoptionRequests } from './pages/shelter/AdoptionRequests';
import { ShelterSettings } from './pages/shelter/ShelterSettings';

// Store Pages
import { Inventory } from './pages/store/Inventory';
import { Orders } from './pages/store/Orders';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/overview" replace />;

  return children;
};

function App() {
  const { token } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/overview" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/overview" replace /> : <Register />} />
      
      <Route path="/" element={<Navigate to="/overview" replace />} />

      <Route element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>}>
        <Route path="/overview" element={<Overview />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        
        {/* Vet Routes */}
        <Route path="/vet/appointments" element={<ProtectedRoute allowedRoles={['vet']}><Appointments /></ProtectedRoute>} />
        <Route path="/vet/patients" element={<ProtectedRoute allowedRoles={['vet']}><PatientHistory /></ProtectedRoute>} />
        <Route path="/vet/settings" element={<ProtectedRoute allowedRoles={['vet']}><ClinicSettings /></ProtectedRoute>} />

        {/* Shelter Routes */}
        <Route path="/shelter/listings" element={<ProtectedRoute allowedRoles={['shelter']}><Listings /></ProtectedRoute>} />
        <Route path="/shelter/requests" element={<ProtectedRoute allowedRoles={['shelter']}><AdoptionRequests /></ProtectedRoute>} />
        <Route path="/shelter/settings" element={<ProtectedRoute allowedRoles={['shelter']}><ShelterSettings /></ProtectedRoute>} />

        {/* Store Routes */}
        <Route path="/store/inventory" element={<ProtectedRoute allowedRoles={['store']}><Inventory /></ProtectedRoute>} />
        <Route path="/store/orders" element={<ProtectedRoute allowedRoles={['store']}><Orders /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}

export default App;
