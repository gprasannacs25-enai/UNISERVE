import { LayoutGrid, Users, Building2, Inbox, BarChart3 } from 'lucide-react';
import AppLayout from './AppLayout';

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/admin/requests', label: 'All requests', icon: Inbox },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export default () => <AppLayout links={links} />;
