import { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, PageHead, StatusBadge, Empty } from '../../components/ui';
import RequestDetail from '../../components/RequestDetail';
import { STATUSES, DEPARTMENTS, SERVICE_TYPES, fmtDate } from '../../data/bmsce';

// Used by staff (their department, optionally one type) and admin (everything).
export default function Requests({ only, all, title = 'Requests' }) {
  const { user, requests, updateRequest, say } = useApp();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [open, setOpen] = useState(null);

  const list = requests
    .filter((r) => (all ? true : r.dept === user.dept))
    .filter((r) => (only ? r.type === only : true))
    .filter((r) => (status === 'All' ? true : r.status === status))
    .filter((r) => (r.title + r.id + r.studentName + r.usn).toLowerCase().includes(q.toLowerCase()));

  const reassign = (r, dept) => {
    updateRequest(r.id, { dept, comment: `Reassigned to ${DEPARTMENTS.find((d) => d.id === dept).name}.` });
    say('Request reassigned');
  };

  return (
    <>
      <PageHead title={title} sub={`${list.length} ${list.length === 1 ? 'request' : 'requests'}`} />
      <div className="row wrap" style={{ marginBottom: 12 }}>
        <div className="search">
          <Search size={15} />
          <input className="input" placeholder="Search by ID, name or USN" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div className="chips" style={{ marginBottom: 20 }}>
        {['All', ...STATUSES].map((s) => <button key={s} className={`chip ${status === s ? 'on' : ''}`} onClick={() => setStatus(s)}>{s}</button>)}
      </div>

      <Card flush>
        {list.length === 0 ? <Empty text="No requests match." /> : (
          <table>
            <thead>
              <tr>
                <th>Request</th><th className="hide-sm">Student</th><th className="hide-sm">Type</th>
                {all && <th>Office</th>}<th>Status</th><th />
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td><div style={{ fontWeight: 500 }}>{r.title}</div><div className="small faint mono">{r.id} · {fmtDate(r.createdAt)}</div></td>
                  <td className="hide-sm"><div>{r.studentName}</div><div className="small faint">{r.usn}</div></td>
                  <td className="hide-sm muted">{SERVICE_TYPES[r.type].label}</td>
                  {all && (
                    <td>
                      <select className="select" style={{ padding: '4px 8px', fontSize: '0.8rem' }} value={r.dept} onChange={(e) => reassign(r, e.target.value)}>
                        {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </td>
                  )}
                  <td><StatusBadge status={r.status} /></td>
                  <td><button className="btn sm" onClick={() => setOpen(r)}>Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {open && <RequestDetail request={open} onClose={() => setOpen(null)} />}
    </>
  );
}
