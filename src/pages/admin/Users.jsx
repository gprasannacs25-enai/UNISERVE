import { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, PageHead } from '../../components/ui';
import { DEPARTMENTS } from '../../data/bmsce';

export default function Users() {
  const { users } = useApp();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('all');
  const list = users
    .filter((u) => (role === 'all' ? true : u.role === role))
    .filter((u) => (u.name + u.email + (u.usn || '')).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHead title="Users" sub={`${users.length} accounts`} />
      <div className="row wrap" style={{ marginBottom: 12 }}>
        <div className="search"><Search size={15} /><input className="input" placeholder="Search name, email or USN" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>
      <div className="chips" style={{ marginBottom: 20 }}>
        {['all', 'student', 'staff', 'admin'].map((r) => <button key={r} className={`chip ${role === r ? 'on' : ''}`} onClick={() => setRole(r)} style={{ textTransform: 'capitalize' }}>{r}</button>)}
      </div>
      <Card flush>
        <table>
          <thead><tr><th>Name</th><th className="hide-sm">Email</th><th>Role</th><th className="hide-sm">Detail</th></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td className="hide-sm muted">{u.email}</td>
                <td><span className="tag" style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                <td className="hide-sm muted">{u.usn || DEPARTMENTS.find((d) => d.id === u.dept)?.name || u.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="small faint" style={{ marginTop: 12 }}>Role and permission editing will be added with the backend.</p>
    </>
  );
}
