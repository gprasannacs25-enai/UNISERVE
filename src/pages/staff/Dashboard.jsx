import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardList, FileCheck2, MessageSquareWarning, ShieldCheck, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, DashboardMetric, RequestRow, Empty } from '../../components/ui';
import RequestDetail from '../../components/RequestDetail';
import { DEPARTMENTS } from '../../data/bmsce';

const QUICK = [
  { to: '/staff/requests', icon: ClipboardList, title: 'All requests', sub: 'Review your department queue' },
  { to: '/staff/verification', icon: FileCheck2, title: 'Verification', sub: 'Open document requests' },
  { to: '/staff/complaints', icon: MessageSquareWarning, title: 'Complaints', sub: 'Review student concerns' },
  { to: '/staff/maintenance', icon: Wrench, title: 'Maintenance', sub: 'View reported campus issues' },
];

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function StaffDashboard() {
  const { user, requests } = useApp();
  const [open, setOpen] = useState(null);
  const dept = DEPARTMENTS.find((d) => d.id === user.dept);
  const mine = requests
    .filter((r) => r.dept === user.dept)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pending = mine.filter((r) => ['Submitted', 'Assigned'].includes(r.status));
  const review = mine.filter((r) => r.status === 'In review');
  const done = mine.filter((r) => r.status === 'Resolved');
  const first = user.name.replace(/^(Mrs?|Dr|Prof)\.?\s+/i, '').split(' ')[0];

  return (
    <>
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-kicker"><ShieldCheck size={14} /> Staff workspace · {user.title || 'Department Officer'}</p>
          <h1>{greeting()}, {first}</h1>
          <p>{dept?.name || 'Your department'} · Review requests and keep the service queue moving.</p>
        </div>
        <Link className="btn primary" to="/staff/requests"><ClipboardList size={16} /> Open request queue</Link>
      </section>

      <div className="grid c4 dashboard-metrics">
        <DashboardMetric icon={ClipboardList} value={mine.length} label="Department requests" />
        <DashboardMetric icon={ShieldCheck} value={pending.length} label="Waiting for action" />
        <DashboardMetric icon={FileCheck2} value={review.length} label="In review" />
        <DashboardMetric icon={CheckCircle2} value={done.length} label="Resolved" />
      </div>

      <div className="dashboard-columns">
        <section className="dashboard-section">
          <div className="section-heading">
            <div><h2>Department requests</h2><p className="small muted">Latest requests assigned to your department</p></div>
            <Link className="link" to="/staff/requests">View queue <ArrowRight size={14} /></Link>
          </div>
          <Card flush className="list">
            {mine.length === 0 ? <Empty text="There are no requests for your department yet." /> :
              mine.slice(0, 6).map((request) => <RequestRow key={request.id} r={request} showStudent onClick={() => setOpen(request)} />)}
          </Card>
        </section>

        <section className="dashboard-section">
          <div className="section-heading"><div><h2>Quick actions</h2><p className="small muted">Open a focused work queue</p></div></div>
          <Card className="dashboard-action-list">
            {QUICK.map(({ to, icon: Icon, title, sub }) => (
              <Link key={title} to={to} className="dashboard-action">
                <span className="dashboard-action-icon"><Icon size={17} /></span>
                <span className="dashboard-action-copy"><strong>{title}</strong><span>{sub}</span></span>
                <ArrowRight size={15} className="dashboard-action-arrow" />
              </Link>
            ))}
            <Link to="/staff/availability" className="dashboard-action">
              <span className="dashboard-action-icon"><CheckCircle2 size={17} /></span>
              <span className="dashboard-action-copy"><strong>Office availability</strong><span>Update your department status</span></span>
              <ArrowRight size={15} className="dashboard-action-arrow" />
            </Link>
          </Card>
        </section>
      </div>

      {open && <RequestDetail request={open} onClose={() => setOpen(null)} />}
    </>
  );
}
