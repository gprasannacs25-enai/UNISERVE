import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { initials } from '../data/bmsce';
import Sidebar from '../components/Sidebar';

// One layout used by all three roles; only the links differ.
export default function AppLayout({ links }) {
  const [open, setOpen] = useState(false);
  const { user, notifications } = useApp();
  const { pathname } = useLocation();
  const activeLink = links.find(({ to, end }) => end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`));
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const hasNotifications = links.some(({ to }) => to.endsWith('/notifications'));

  return (
    <div className="shell">
      <Sidebar links={links} open={open} onNavigate={() => setOpen(false)} />
      {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="Close navigation" />}
      <div className="main">
        <header className="topbar">
          <div className="topbar-leading">
            <button
              className="icon-btn menu-toggle"
              onClick={() => setOpen((current) => !current)}
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
            <div className="topbar-context">
              <span className="topbar-eyebrow">{user.role} workspace</span>
              <strong>{activeLink?.label || 'Overview'}</strong>
            </div>
          </div>
          <div className="topbar-actions">
            {hasNotifications && (
              <Link className="icon-btn notification-link" to={`/${user.role}/notifications`} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </Link>
            )}
            <div className="topbar-user">
              <span className="avatar">{initials(user.name)}</span>
              <span className="topbar-user-copy">
                <strong>{user.name}</strong>
                <span>{user.title || user.usn || user.role}</span>
              </span>
            </div>
          </div>
        </header>
        <div className="content"><Outlet /></div>
      </div>
    </div>
  );
}
