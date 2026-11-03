import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Building2, ClipboardList, FileText, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, DashboardMetric, Empty, RequestRow } from '../../components/ui';
import RequestDetail from '../../components/RequestDetail';
import { DEPARTMENTS, SERVICE_TYPES } from '../../data/bmsce';

export const isOverdue = (r) => {
  if (['Resolved', 'Rejected'].includes(r.status)) return false;
  const days = SERVICE_TYPES[r.type]?.items?.find((i) => i.id === r.item)?.days ?? 3;
  return (Date.now() - new Date(r.createdAt)) / 864e5 > days;
};

export default function AdminDashboard() {
  const { user, requests, users } = useApp();
  const [openRequest, setOpenRequest] = useState(null);
  const open = requests.filter((r) => !['Resolved', 'Rejected'].includes(r.status));
  const overdue = requests.filter(isOverdue);
  const resolved = requests.filter((r) => r.status === 'Resolved');
  const resolutionRate = requests.length ? Math.round((resolved.length / requests.length) * 100) : null;
  const recent = [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const first = user.name.split(' ')[0];

  return (
    <>
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-kicker"><Activity size={14} /> Campus administration</p>
          <h1>Welcome, {first}</h1>
          <p>Monitor campus service requests and manage the UniServe directory.</p>
        </div>
        <span className="dashboard-resolution">{resolutionRate === null ? 'No request data' : `${resolutionRate}% resolved`}</span>
      </section>

      <div className="grid c4 dashboard-metrics">
        <DashboardMetric icon={FileText} value={requests.length} label="Total requests" />
        <DashboardMetric icon={ClipboardList} value={open.length} label="Open in queue" />
        <DashboardMetric icon={Activity} value={overdue.length} label="Overdue requests" />
        <DashboardMetric icon={Users} value={users.length} label="Accounts" />
      </div>

      <div className="dashboard-columns admin-dashboard-columns">
        <section className="dashboard-section">
          <div className="section-heading">
            <div><h2>Recent campus requests</h2><p className="small muted">Latest activity across departments</p></div>
            <Link className="link" to="/admin/requests">All requests <ArrowRight size={14} /></Link>
          </div>
          <Card flush className="list">
            {recent.length === 0 ? <Empty text="Campus requests will appear here when submitted." /> :
              recent.map((request) => <RequestRow key={request.id} r={request} showStudent onClick={() => setOpenRequest(request)} />)}
          </Card>
        </section>

        <div className="dashboard-rail">
          <section className="dashboard-section">
            <div className="section-heading"><div><h2>Management</h2><p className="small muted">Administrative tools</p></div></div>
            <Card className="dashboard-action-list">
              <Link to="/admin/users" className="dashboard-action">
                <span className="dashboard-action-icon"><Users size={17} /></span>
                <span className="dashboard-action-copy"><strong>Manage users</strong><span>Review campus accounts</span></span>
                <ArrowRight size={15} className="dashboard-action-arrow" />
              </Link>
              <Link to="/admin/departments" className="dashboard-action">
                <span className="dashboard-action-icon"><Building2 size={17} /></span>
                <span className="dashboard-action-copy"><strong>Departments</strong><span>Manage service offices</span></span>
                <ArrowRight size={15} className="dashboard-action-arrow" />
              </Link>
              <Link to="/admin/reports" className="dashboard-action">
                <span className="dashboard-action-icon"><Activity size={17} /></span>
                <span className="dashboard-action-copy"><strong>Reports</strong><span>Review service performance</span></span>
                <ArrowRight size={15} className="dashboard-action-arrow" />
              </Link>
            </Card>
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div><h2>Overdue requests</h2><p className="small muted">Compared with service turnaround targets</p></div>
              <Link className="link" to="/admin/requests">Queue <ArrowRight size={14} /></Link>
            </div>
            <Card flush className="list">
              {overdue.length === 0 ? <Empty text="No overdue requests at this time." /> : overdue.slice(0, 4).map((request) => {
                const department = DEPARTMENTS.find((item) => item.id === request.dept);
                return (
                  <button className="item overdue-item" type="button" key={request.id} onClick={() => setOpenRequest(request)}>
                    <span className="grow">
                      <span className="title">{request.title}</span>
                      <span className="small faint">{request.id} · {department?.name || 'Department'}</span>
                    </span>
                    <span className="badge bad">Overdue</span>
                  </button>
                );
              })}
            </Card>
          </section>
        </div>
      </div>

      {openRequest && <RequestDetail request={openRequest} onClose={() => setOpenRequest(null)} />}
    </>
  );
}
