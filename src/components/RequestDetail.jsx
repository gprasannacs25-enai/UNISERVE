import { useState } from 'react';
import { Modal, StatusBadge, Timeline, Field } from './ui';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, SERVICE_TYPES, STATUSES, fmtDate } from '../data/bmsce';

// Shared request detail. Students see a read-only timeline; staff/admin can act.
export default function RequestDetail({ request, onClose }) {
  const { user, updateRequest, requests, say } = useApp();
  const r = requests.find((x) => x.id === request.id) || request;
  const canAct = user.role !== 'student';
  const [status, setStatus] = useState(r.status);
  const [comment, setComment] = useState('');
  const dept = DEPARTMENTS.find((d) => d.id === r.dept);

  const save = () => {
    if (status === r.status && !comment.trim()) return;
    updateRequest(r.id, { status, comment: comment.trim() });
    setComment('');
    say('Request updated');
  };

  return (
    <Modal title={r.id} onClose={onClose}>
      <div className="stack">
        <div>
          <div className="row between">
            <h3>{r.title}</h3>
            <StatusBadge status={r.status} />
          </div>
          <div className="small muted" style={{ marginTop: 4 }}>
            {SERVICE_TYPES[r.type].label} · {dept?.name} · {fmtDate(r.createdAt)}
          </div>
          {canAct && <div className="small muted">{r.studentName} · {r.usn}</div>}
        </div>

        {r.details && <p className="muted">{r.details}</p>}
        {r.location && <p className="small muted">Location: {r.location}</p>}

        <div>
          <h3 style={{ marginBottom: 12 }}>Progress</h3>
          <Timeline steps={r.timeline} />
        </div>

        {r.comments.length > 0 && (
          <div>
            <h3 style={{ marginBottom: 8 }}>Comments</h3>
            <div className="stack" style={{ gap: 10 }}>
              {r.comments.map((c, i) => (
                <div key={i} className="small">
                  <strong>{c.by}</strong> <span className="faint">· {fmtDate(c.at)}</span>
                  <div className="muted">{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {canAct && (
          <div className="stack" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <Field label="Status">
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Comment (visible to student)">
              <textarea className="textarea" value={comment} onChange={(e) => setComment(e.target.value)} />
            </Field>
            <button className="btn primary" onClick={save}>Save update</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
