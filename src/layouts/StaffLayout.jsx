import { LayoutGrid, Inbox, FileCheck2, MessageSquareWarning, Wrench, CalendarClock, MessagesSquare } from 'lucide-react';
import AppLayout from './AppLayout';

const links = [
  { to: '/staff', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/staff/requests', label: 'All requests', icon: Inbox },
  { to: '/staff/verification', label: 'Verification', icon: FileCheck2 },
  { to: '/staff/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { to: '/staff/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/staff/availability', label: 'Availability', icon: CalendarClock },
  { to: '/staff/unihelp', label: 'UniHelp', icon: MessagesSquare },
];

export default () => <AppLayout links={links} />;
