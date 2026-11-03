import { useEffect } from 'react';
import { Inbox } from 'lucide-react';
import { statusTone, fmtDate } from '../data/bmsce';

export const StatusBadge = ({ status }) => <span className={`badge ${statusTone(status)}`}>{status}</span>;

export const Card = ({ children, flush, className = '', ...p }) => (
  <div className={`card ${flush ? 'flush' : ''} ${className}`} {...p}>{children}</div>
);

export const Stat = ({ num, label }) => (
  <Card className="stat">
    <div className="num mono">{num}</div>
    <div className="label">{label}</div>
  </Card>
);

export const DashboardMetric = ({ icon: Icon, value, label, detail }) => (
  <Card className="dashboard-metric">
    <div className="metric-topline">
      {Icon && <span className="metric-icon"><Icon size={18} strokeWidth={1.8} /></span>}
      {detail && <span className="metric-detail">{detail}</span>}
    </div>
    <div className="metric-value mono">{value}</div>
    <div className="metric-label">{label}</div>
  </Card>
);

export const ModernStat = ({ icon: Icon, num, label, trend }) => (
  <Card className="stat">
    <div className="row between" style={{ marginBottom: 8 }}>
      {Icon && <div style={{ color: 'var(--accent)' }}><Icon size={20} /></div>}
      {trend && <span className="tag" style={{ color: 'var(--ok)', background: 'var(--ok-soft)' }}>+{trend}%</span>}
    </div>
    <div className="num mono">{num}</div>
    <div className="label faint">{label}</div>
  </Card>
);

export const PageHead = ({ title, sub, children }) => (
  <div className="page-head">
    <div>
      <h1>{title}</h1>
      {sub && <p className="muted">{sub}</p>}
    </div>
    {children}
  </div>
);

export const Empty = ({ text = 'Nothing here yet.' }) => (
  <div className="empty"><Inbox size={24} /><div>{text}</div></div>
);

export const Field = ({ label, error, children }) => (
  <div className="field">
    {label && <label>{label}</label>}
    {children}
    {error && <span className="err">{error}</span>}
  </div>
);

export const Modal = ({ title, onClose, children }) => (
  <div className="overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
      <div className="row between" style={{ marginBottom: 16 }}>
        <h2>{title}</h2>
        <button className="btn ghost sm" onClick={onClose}>Close</button>
      </div>
      {children}
    </div>
  </div>
);

export const Timeline = ({ steps }) => (
  <div className="timeline">
    {steps.map((t, i) => (
      <div className="tl" key={i}>
        <span className={`dot ${i === steps.length - 1 ? (t.s === 'Resolved' || t.s === 'Rejected' ? 'done' : 'now') : 'done'}`} />
        <div>
          <div style={{ fontWeight: 500 }}>{t.s}</div>
          <div className="small faint">{fmtDate(t.at)}</div>
        </div>
      </div>
    ))}
  </div>
);

export const RequestRow = ({ r, onClick, showStudent }) => (
  <button className="item click request-row" type="button" onClick={onClick} aria-label={`Open request ${r.id}: ${r.title}`}>
    <span className="grow">
      <span className="title">{r.title}</span>
      <span className="small faint mono">
        {r.id} · {fmtDate(r.createdAt)}{showStudent ? ` · ${r.studentName} (${r.usn})` : ''}
      </span>
    </span>
    <StatusBadge status={r.status} />
  </button>
);

export const Skeleton = ({ width = '100%', height = '16px', style, className = '' }) => (
  <div className={`skeleton ${className}`} style={{ width, height, ...style }} />
);

export const SkeletonCard = () => (
  <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Skeleton width="40%" height="20px" />
    <Skeleton width="90%" height="14px" />
    <Skeleton width="60%" height="14px" />
  </Card>
);

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="alert" onClick={onClose} style={{ cursor: 'pointer' }}>
      <span>{message}</span>
    </div>
  );
};