import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import CAGEManagement from './pages/CAGEManagement/CAGEManagement';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route element={<CAGEManagement />} />
          <Route  element={<div>Projects Page</div>} />
          <Route path="data-module">
            <Route path="manage" element={<div>Manage Modules</div>} />
            <Route path="validate" element={<div>Data Validate</div>} />
            <Route path="search" element={<div>Search</div>} />
            <Route path="publishing" element={<div>Publishing</div>} />
            <Route path="import" element={<div>Import</div>} />
            <Route path="export" element={<div>Export</div>} />
          </Route>
          <Route  element={<div>Common Information Repository</div>} />
          <Route path="users" element={<div>Users Management</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
