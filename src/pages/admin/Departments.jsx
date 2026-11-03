import { useApp } from '../../context/AppContext';
import { Card, PageHead } from '../../components/ui';
import { DEPARTMENTS, SERVICE_TYPES } from '../../data/bmsce';

export default function Departments() {
  const { requests } = useApp();
  const services = Object.values(SERVICE_TYPES).flatMap((g) => g.items);
  return (
    <>
      <PageHead title="Departments" sub="Offices and the services routed to them." />
      <Card flush>
        <table>
          <thead><tr><th>Office</th><th className="hide-sm">Head</th><th>Services</th><th>Open</th></tr></thead>
          <tbody>
            {DEPARTMENTS.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 500 }}>{d.name}</td>
                <td className="hide-sm muted">{d.head}</td>
                <td className="mono">{services.filter((s) => s.dept === d.id).length}</td>
                <td className="mono">{requests.filter((r) => r.dept === d.id && !['Resolved', 'Rejected'].includes(r.status)).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
