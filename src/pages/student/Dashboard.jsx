import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, CalendarClock, FilePlus2, FileText, MessageSquare, ClipboardList } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, DashboardMetric, RequestRow, Empty } from '../../components/ui';
import RequestDetail from '../../components/RequestDetail';
import { BRANCHES, timeAgo } from '../../data/bmsce';

const QUICK = [
  { to: '/student/services', icon: FilePlus2, title: 'New service request', sub: 'Browse available college services' },
  { to: '/student/requests', icon: ClipboardList, title: 'My requests', sub: 'Track current and completed requests' },
  { to: '/student/availability', icon: CalendarClock, title: 'Office availability', sub: 'Check the latest office updates' },
  { to: '/student/unihelp', icon: MessageSquare, title: 'UniHelp', sub: 'Browse campus questions and answers' },
];

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function Dashboard() {
  const { user, requests, availability, notifications } = useApp();
  const [open, setOpen] = useState(null);
  const mine = requests
    .filter((r) => r.studentId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const active = mine.filter((r) => !['Resolved', 'Rejected'].includes(r.status));
  const resolved = mine.filter((r) => r.status === 'Resolved');
  const unread = notifications.filter((notification) => !notification.read).length;
  const branch = BRANCHES.find((b) => b.code === user.branch);
  const first = user.name.split(' ')[0];
  const recentOffices = [...availability]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  return (
    <>
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-kicker">Student portal{user.usn ? ` · ${user.usn}` : ''}</p>
          <h1>{greeting()}, {first}</h1>
          <p>{branch?.name || 'Your college services'}{user.sem ? ` · Semester ${user.sem}` : ''}. Keep track of requests and check office updates before you visit.</p>
        </div>
        <Link className="btn primary" to="/student/services"><FilePlus2 size={16} /> Create a request</Link>
      </section>

      <div className="grid c4 dashboard-metrics">
        <DashboardMetric icon={FileText} value={mine.length} label="Total requests" />
        <DashboardMetric icon={CalendarClock} value={active.length} label="In progress" />
        <DashboardMetric icon={ClipboardList} value={resolved.length} label="Resolved" />
        <DashboardMetric icon={Bell} value={unread} label="Unread notifications" />
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-main-column">
          <section className="dashboard-section">
            <div className="section-heading">
              <div><h2>Recent requests</h2><p className="small muted">Your latest service activity</p></div>
              <Link className="link" to="/student/requests">View all <ArrowRight size={14} /></Link>
            </div>
            <Card flush className="list">
              {mine.length === 0 ? <Empty text="Your requests will appear here once submitted." /> :
                mine.slice(0, 5).map((request) => <RequestRow key={request.id} r={request} onClick={() => setOpen(request)} />)}
            </Card>
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div><h2>Office updates</h2><p className="small muted">Most recently updated</p></div>
              <Link className="link" to="/student/availability">All offices <ArrowRight size={14} /></Link>
            </div>
            <Card flush className="list">
              {recentOffices.length === 0 ? <Empty text="Office availability is not available yet." /> : recentOffices.map((office) => {
                const statusKey = office.status.toLowerCase();
                return (
                  <div className="office-row" key={office.id}>
                    <div className="grow">
                      <div className="row between wrap">
                        <strong>{office.name}</strong>
                        <span className={`status-pill ${statusKey}`}><span className={`status-indicator ${statusKey}`} />{office.status}</span>
                      </div>
                      <p className="small muted">{office.place} · updated {timeAgo(office.updatedAt)}</p>
                      {office.note && <p className="small faint">{office.note}</p>}
                    </div>
                  </div>
                );
              })}
            </Card>
          </section>
        </div>

        <div className="dashboard-rail">
          <section className="dashboard-section">
            <div className="section-heading"><div><h2>Quick actions</h2><p className="small muted">Go straight to a common task</p></div></div>
            <Card className="dashboard-action-list">
              {QUICK.map(({ to, icon: Icon, title, sub }) => (
                <Link key={title} to={to} className="dashboard-action">
                  <span className="dashboard-action-icon"><Icon size={17} /></span>
                  <span className="dashboard-action-copy"><strong>{title}</strong><span>{sub}</span></span>
                  <ArrowRight size={15} className="dashboard-action-arrow" />
                </Link>
              ))}
            </Card>
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div><h2>Notifications</h2><p className="small muted">Recent updates for you</p></div>
              <Link className="link" to="/student/notifications">See all <ArrowRight size={14} /></Link>
            </div>
            <Card flush className="list">
              {notifications.length === 0 ? <Empty text="You are all caught up." /> : notifications.slice(0, 3).map((notification) => (
                <div className="item notification-item" key={notification.id}>
                  <span className={`notification-dot ${notification.read ? '' : 'unread'}`} />
                  <div className="grow">
                    <div className="notification-text">{notification.text}</div>
                    <div className="small faint">{timeAgo(notification.at)}</div>
                  </div>
                </div>
              ))}
            </Card>
          </section>
        </div>
      </div>

      {open && <RequestDetail request={open} onClose={() => setOpen(null)} />}
    </>
  );
}
