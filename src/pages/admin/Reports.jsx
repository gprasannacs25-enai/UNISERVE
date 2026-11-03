import { useApp } from '../../context/AppContext';
import { Card, PageHead } from '../../components/ui';
import { DEPARTMENTS, SERVICE_TYPES, STATUSES } from '../../data/bmsce';

const Bars = ({ rows }) => {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div className="stack" style={{ gap: 12 }}>
      {rows.map((r) => (
        <div className="bar-row" key={r.label}>
          <span className="muted">{r.label}</span>
          <div className="bar"><span style={{ width: `${(r.n / max) * 100}%` }} /></div>
          <span className="mono small" style={{ textAlign: 'right' }}>{r.n}</span>
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const { requests } = useApp();
  const byStatus = STATUSES.map((s) => ({ label: s, n: requests.filter((r) => r.status === s).length }));
  const byType = Object.entries(SERVICE_TYPES).map(([k, v]) => ({ label: v.label, n: requests.filter((r) => r.type === k).length }));
  const byDept = DEPARTMENTS.map((d) => ({ label: d.name, n: requests.filter((r) => r.dept === d.id).length })).filter((x) => x.n > 0);

  return (
    <>
      <PageHead title="Reports" sub="Live from current requests." />
      <div className="grid c2">
        <Card><h3 style={{ marginBottom: 16 }}>By status</h3><Bars rows={byStatus} /></Card>
        <Card><h3 style={{ marginBottom: 16 }}>By type</h3><Bars rows={byType} /></Card>
      </div>
      <Card style={{ marginTop: 16 }}><h3 style={{ marginBottom: 16 }}>By office</h3><Bars rows={byDept} /></Card>
    </>
  );
}
