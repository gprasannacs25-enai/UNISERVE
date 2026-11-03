import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, PageHead, Field } from '../../components/ui';
import { SERVICE_TYPES, DEPARTMENTS, LOCATIONS } from '../../data/bmsce';

export default function Services() {
  const { createRequest, say } = useApp();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const type = SERVICE_TYPES[params.get('type')] ? params.get('type') : 'document';
  const group = SERVICE_TYPES[type];

  const [item, setItem] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const switchType = (t) => { setParams({ type: t }); setItem(''); setErrors({}); };
  const selected = group.items.find((i) => i.id === item);
  const dept = selected && DEPARTMENTS.find((d) => d.id === selected.dept);

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!item) er.item = 'Choose a service.';
    if (details.trim().length < 10) er.details = 'Add a few details (at least 10 characters).';
    if (type === 'document' && !file) er.file = 'Attach the document to be verified.';
    if (Object.keys(er).length) return setErrors(er);
    const r = createRequest({ type, item, details: details.trim(), location: type === 'maintenance' ? location : undefined });
    say(`${r.id} submitted`);
    nav('/student/requests');
  };

  return (
    <>
      <PageHead title="Services" sub="Pick a service. We route it to the right BMSCE office." />

      <div className="tabs">
        {Object.entries(SERVICE_TYPES).map(([k, v]) => (
          <button key={k} className={`tab ${k === type ? 'on' : ''}`} onClick={() => switchType(k)}>{v.label}</button>
        ))}
      </div>

      <Card>
        <form className="stack" onSubmit={submit} noValidate>
          <Field label="What do you need?" error={errors.item}>
            <select className={`select ${errors.item ? 'invalid' : ''}`} value={item} onChange={(e) => setItem(e.target.value)}>
              <option value="">Select…</option>
              {group.items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </Field>

          {selected && (
            <p className="small muted">
              Goes to <strong>{dept?.name}</strong>. Usual turnaround: {selected.days} working days.
            </p>
          )}

          {type === 'maintenance' && (
            <Field label="Location">
              <select className="select" value={location} onChange={(e) => setLocation(e.target.value)}>
                {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
          )}

          <Field label="Details" error={errors.details}>
            <textarea className={`textarea ${errors.details ? 'invalid' : ''}`} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe what you need or what went wrong." />
          </Field>

          {(type === 'document' || type === 'service') && (
            <Field label={type === 'document' ? 'Document' : 'Supporting file (optional)'} error={errors.file}>
              <label className="btn" style={{ justifyContent: 'flex-start' }}>
                <Upload size={15} /> {file ? file.name : 'Choose file'}
                <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0] || null)} />
              </label>
              <span className="small faint">PDF, JPG or PNG. Upload is simulated until the backend is connected.</span>
            </Field>
          )}

          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn primary" type="submit">Submit request</button>
          </div>
        </form>
      </Card>
    </>
  );
}
