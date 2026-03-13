import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/layout/AppShell'

// Auth pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

// Protected pages
import Home from './pages/Home'
import Pets from './pages/Pets'
import PetDetail from './pages/Pets/PetDetail'
import Appointments from './pages/Appointments'
import BookAppointment from './pages/Appointments/BookAppointment'
import Adoption from './pages/Adoption'
import Community from './pages/Community'
import Emergency from './pages/Emergency'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />

      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected wrapper */}
        <Route element={<ProtectedRoute />}>

          {/* App layout */}
          <Route element={<AppShell />}>

            <Route path="/" element={<Home />} />

            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:id" element={<PetDetail />} />

            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/book" element={<BookAppointment />} />

            <Route path="/adoption" element={<Adoption />} />

            <Route path="/community" element={<Community />} />

            <Route path="/emergency" element={<Emergency />} />

            <Route path="/notifications" element={<Notifications />} />

            <Route path="/profile" element={<Settings />} />
            <Route path="/settings" element={<Settings />} />

          </Route>

        </Route>

      </Routes>
    </AuthProvider>
  )
}