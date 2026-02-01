import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import Login from './features/auth/Login';
import RegisterDonor from './features/auth/RegisterDonor';
import RegisterRecipient from './features/auth/RegisterRecipient';
import DashboardRouter from './components/layout/DashboardRouter';
import DonorSearch from './features/recipient/DonorSearch';
import Chat from './features/chat/Chat';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminHome from './features/admin/AdminHome';
import LandingPage from './features/auth/LandingPage';
import Profile from './features/auth/Profile';
import History from './components/ui/History';
import { useAuth } from './context/AuthContext';
import DocumentViewer from './components/ui/DocumentViewer';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) return null;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={!currentUser ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register-donor" element={!currentUser ? <RegisterDonor /> : <Navigate to="/dashboard" />} />
        <Route path="/register-recipient" element={!currentUser ? <RegisterRecipient /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={currentUser ? <DashboardRouter /> : <Navigate to="/login" />} />
        <Route path="/search" element={currentUser?.role === 'recipient' ? <DonorSearch /> : <Navigate to="/dashboard" />} />
        <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/history" element={currentUser ? <History /> : <Navigate to="/login" />} />
        <Route path="/chat/:chatId" element={currentUser ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/document-viewer" element={currentUser ? <DocumentViewer /> : <Navigate to="/login" />} />
        <Route path="/admin" element={currentUser?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
        <Route path="/admin-home" element={<AdminHome />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
