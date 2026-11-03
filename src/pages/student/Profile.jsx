import { useApp } from '../../context/AppContext';
import { Card, PageHead } from '../../components/ui';
import { BRANCHES, CAMPUS } from '../../data/bmsce';

export default function Profile() {
  const { user, resetDemo } = useApp();
  const branch = BRANCHES.find((b) => b.code === user.branch);
  const rows = [
    ['Name', user.name],
    ['USN', user.usn],
    ['Email', user.email],
    ['Branch', branch ? `${branch.name} (${branch.code})` : '—'],
    ['Semester', user.sem],
    ['Institution', `${CAMPUS.name}, ${CAMPUS.place}`],
  ];
  return (
    <>
      <PageHead title="Profile" />
      <Card flush>
        <table>
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}><td className="muted" style={{ width: 160 }}>{k}</td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="section">
        <h3>Demo data</h3>
        <p className="small muted" style={{ margin: '4px 0 12px' }}>Everything is stored in this browser only. Reset to restore the sample data.</p>
        <button className="btn" onClick={resetDemo}>Reset demo data</button>
      </div>
    </>
  );
}
