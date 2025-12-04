import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastProvider } from './contexts/ToastContext';
import { SideSheetProvider } from './contexts/SideSheetContext';
import { EndItemProvider } from './contexts/EndItemContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import CAGEManagement from './pages/CAGEManagement/CAGEManagement';
import EndItems from './pages/EndItems/EndItems';
import S1000D from './pages/S1000D/S1000D';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <ToastProvider>
      <SideSheetProvider>
        <EndItemProvider>
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
          <Route path="end-items" element={<EndItems />} />
          <Route path="cage-management" element={<CAGEManagement />} />
          <Route path="s1000d" element={<S1000D />} />
          <Route path="projects" element={<div>Projects Page</div>} />
          <Route path="data-module">
            <Route path="manage" element={<div>Manage Modules</div>} />
            <Route path="validate" element={<div>Data Validate</div>} />
            <Route path="search" element={<div>Search</div>} />
            <Route path="publishing" element={<div>Publishing</div>} />
            <Route path="import" element={<div>Import</div>} />
            <Route path="export" element={<div>Export</div>} />
          </Route>
          <Route path="entities" element={<div>Entities / Missed Entities Table</div>} />
          <Route path="common-info" element={<div>CIR</div>} />
          <Route path="users" element={<div>User Management</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
          </Router>
        </EndItemProvider>
      </SideSheetProvider>
    </ToastProvider>
  );
}

export default App;
