import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout';
import StaffLayout from './layouts/StaffLayout';
import AdminLayout from './layouts/AdminLayout';
import DemoSwitcher from './components/DemoSwitcher';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import SDashboard from './pages/student/Dashboard';
import Services from './pages/student/Services';
import MyRequests from './pages/student/MyRequests';
import UniHelp from './pages/student/UniHelp';
import Availability from './pages/student/Availability';
import Notifications from './pages/student/Notifications';
import Profile from './pages/student/Profile';

import StDashboard from './pages/staff/Dashboard';
import StRequests from './pages/staff/Requests';

import ADashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Departments from './pages/admin/Departments';
import Reports from './pages/admin/Reports';

function Home() {
  const { user } = useApp();
  return <Navigate to={user ? `/${user.role}` : '/login'} replace />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<SDashboard />} />
            <Route path="services" element={<Services />} />
            <Route path="requests" element={<MyRequests />} />
            <Route path="unihelp" element={<UniHelp />} />
            <Route path="availability" element={<Availability />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/staff" element={<ProtectedRoute role="staff"><StaffLayout /></ProtectedRoute>}>
            <Route index element={<StDashboard />} />
            <Route path="requests" element={<StRequests />} />
            <Route path="verification" element={<StRequests only="document" title="Document verification" />} />
            <Route path="complaints" element={<StRequests only="complaint" title="Complaints" />} />
            <Route path="maintenance" element={<StRequests only="maintenance" title="Maintenance" />} />
            <Route path="availability" element={<Availability manage />} />
            <Route path="unihelp" element={<UniHelp />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<ADashboard />} />
            <Route path="requests" element={<StRequests all title="All requests" />} />
            <Route path="users" element={<Users />} />
            <Route path="departments" element={<Departments />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>

        {/* Quick Demo Switcher for fast role preview in reviews/labs */}
        <DemoSwitcher />
      </BrowserRouter>
    </AppProvider>
  );
}