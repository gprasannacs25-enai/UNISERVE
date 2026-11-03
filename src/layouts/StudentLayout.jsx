import { Home, FilePlus2, ListChecks, MessagesSquare, CalendarClock, Bell, User } from 'lucide-react';
import AppLayout from './AppLayout';

const links = [
  { to: '/student', label: 'Home', icon: Home, end: true },
  { to: '/student/services', label: 'Services', icon: FilePlus2 },
  { to: '/student/requests', label: 'My requests', icon: ListChecks },
  { to: '/student/unihelp', label: 'UniHelp', icon: MessagesSquare },
  { to: '/student/availability', label: 'Availability', icon: CalendarClock },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
  { to: '/student/profile', label: 'Profile', icon: User },
];

export default () => <AppLayout links={links} />;
