import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initials } from '../data/bmsce';

export default function Sidebar({ links, open, onNavigate }) {
  const { user, logout } = useApp();
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label={`${user.role} navigation`}>
      <div className="brand">
        <div className="brand-mark">U</div>
        <div>
          <div className="brand-name">UniServe</div>
          <div className="brand-sub">BMSCE</div>
        </div>
        {open && <button className="icon-btn sidebar-close" onClick={onNavigate} aria-label="Close navigation"><X size={18} /></button>}
      </div>

      <nav className="nav" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={17} strokeWidth={1.75} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="me">
          <div className="avatar">{initials(user.name)}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div className="small faint">{user.usn || user.title}</div>
          </div>
        </div>
        <button className="btn ghost sm sign-out" onClick={logout}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );
}
