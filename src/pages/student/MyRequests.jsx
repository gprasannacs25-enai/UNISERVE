import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, PageHead, RequestRow, Empty } from '../../components/ui';
import RequestDetail from '../../components/RequestDetail';

const FILTERS = ['All', 'Active', 'Resolved'];

export default function MyRequests() {
  const { user, requests } = useApp();
  const [q, setQ] = useState('');
  const [f, setF] = useState('All');
  const [open, setOpen] = useState(null);

  const list = requests
    .filter((r) => r.studentId === user.id)
    .filter((r) => (f === 'All' ? true : f === 'Resolved' ? ['Resolved', 'Rejected'].includes(r.status) : !['Resolved', 'Rejected'].includes(r.status)))
    .filter((r) => (r.title + r.id).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHead title="My requests" sub="Track every request in one place.">
        <Link className="btn primary" to="/student/services">New request</Link>
      </PageHead>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <div className="search">
          <Search size={15} />
          <input className="input" placeholder="Search by title or ID" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="chips">
          {FILTERS.map((x) => <button key={x} className={`chip ${f === x ? 'on' : ''}`} onClick={() => setF(x)}>{x}</button>)}
        </div>
      </div>

      <Card flush className="list">
        {list.length === 0 ? <Empty text="No matching requests." /> : list.map((r) => <RequestRow key={r.id} r={r} onClick={() => setOpen(r)} />)}
      </Card>

      {open && <RequestDetail request={open} onClose={() => setOpen(null)} />}
    </>
  );
}
