import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function DemoSwitcher() {
  const { user, login, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const switchAccount = (role) => {
    if (role === 'student') {
      login('1BM24CS001', 'demo123');
      navigate('/student');
    } else if (role === 'staff') {
      login('kavitha@bmsce.ac.in', 'demo123');
      navigate('/staff');
    } else if (role === 'admin') {
      login('admin@bmsce.ac.in', 'demo123');
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '18px',
        left: '18px',
        zIndex: 900,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #dfeae4',
        padding: '5px 12px',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.78rem',
        boxShadow: '0 8px 24px rgba(30, 38, 34, 0.08)',
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{ color: '#74877e', fontWeight: 500, marginRight: 2 }}>Demo:</span>
      
      <button
        type="button"
        style={{
          border: '1px solid',
          borderColor: user?.role === 'student' ? '#c2ebd6' : 'transparent',
          background: user?.role === 'student' ? '#e9f7f0' : 'transparent',
          color: user?.role === 'student' ? '#1e754d' : '#52635a',
          fontWeight: user?.role === 'student' ? '600' : '500',
          padding: '3px 10px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.75rem',
          transition: 'all 0.15s ease',
        }}
        onClick={() => switchAccount('student')}
      >
        Student
      </button>

      <button
        type="button"
        style={{
          border: '1px solid',
          borderColor: user?.role === 'staff' ? '#fce0c0' : 'transparent',
          background: user?.role === 'staff' ? '#fef5eb' : 'transparent',
          color: user?.role === 'staff' ? '#ad6215' : '#52635a',
          fontWeight: user?.role === 'staff' ? '600' : '500',
          padding: '3px 10px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.75rem',
          transition: 'all 0.15s ease',
        }}
        onClick={() => switchAccount('staff')}
      >
        Staff
      </button>

      <button
        type="button"
        style={{
          border: '1px solid',
          borderColor: user?.role === 'admin' ? '#d2e4de' : 'transparent',
          background: user?.role === 'admin' ? '#eff5f5' : 'transparent',
          color: user?.role === 'admin' ? '#25704d' : '#52635a',
          fontWeight: user?.role === 'admin' ? '600' : '500',
          padding: '3px 10px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.75rem',
          transition: 'all 0.15s ease',
        }}
        onClick={() => switchAccount('admin')}
      >
        Admin
      </button>

      {user && (
        <>
          <span style={{ color: '#cbd8d1' }}>|</span>
          <button
            type="button"
            title="Sign out to view Login Page"
            style={{
              border: '1px solid #fad0d7',
              background: '#fdf2f4',
              color: '#b73648',
              fontWeight: '500',
              padding: '3px 8px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.73rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
            onClick={handleLogout}
          >
            <LogOut size={11} /> Logout
          </button>
        </>
      )}
    </div>
  );
}
