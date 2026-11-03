import { useState } from 'react';
import { Bell, BellRing, CalendarPlus, Check, Edit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, PageHead, Modal, Field } from '../../components/ui';
import { timeAgo } from '../../data/bmsce';

const OPTIONS = [
  { value: 'Available', label: 'Available', color: 'available' },
  { value: 'Tentative', label: 'Tentative', color: 'tentative' },
  { value: 'Unavailable', label: 'Unavailable', color: 'unavailable' },
];

export default function Availability({ manage }) {
  const { availability, setOffice, say } = useApp();
  const [filter, setFilter] = useState('All');
  const [watch, setWatch] = useState(() => {
    try { return JSON.parse(localStorage.getItem('us_watch') || '[]'); } catch { return []; }
  });
  const [book, setBook] = useState(null);
  const [slot, setSlot] = useState('');
  const [reason, setReason] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  const toggleWatch = (id) => {
    const next = watch.includes(id) ? watch.filter((x) => x !== id) : [...watch, id];
    setWatch(next);
    try { localStorage.setItem('us_watch', JSON.stringify(next)); } catch { /* ignore */ }
    say(next.includes(id) ? 'Subscribed to office updates' : 'Notification turned off');
  };

  const confirm = () => {
    if (!slot || reason.trim().length < 5) return say('Choose a time and add a reason');
    say(`Appointment requested with ${book.name}`);
    setBook(null); setSlot(''); setReason('');
  };

  const handleUpdateStatus = (officeId, officeName, status) => {
    setOffice(officeId, { status });
    say(`${officeName} is now ${status}`);
  };

  const handleSaveNote = (officeId, officeName) => {
    setOffice(officeId, { note: noteText });
    say(`Note updated for ${officeName}`);
    setEditingNote(null);
  };

  const filtered = availability.filter((o) => {
    if (filter === 'All') return true;
    return o.status.toLowerCase() === filter.toLowerCase();
  });

  const availableCount = availability.filter((o) => o.status === 'Available').length;
  const tentativeCount = availability.filter((o) => o.status === 'Tentative').length;
  const unavailableCount = availability.filter((o) => o.status === 'Unavailable').length;

  return (
    <>
      <PageHead
        title="Office Availability"
        sub={manage ? 'Update your department status in real-time to guide students.' : 'Live status of campus service offices before you walk across campus.'}
      />

      {/* Filter Tabs with Live Status Counters */}
      <div className="tabs" style={{ marginBottom: 18 }}>
        <button type="button" className={`tab ${filter === 'All' ? 'on' : ''}`} onClick={() => setFilter('All')}>
          All Offices ({availability.length})
        </button>
        <button type="button" className={`tab ${filter === 'Available' ? 'on' : ''}`} onClick={() => setFilter('Available')}>
          <span className="status-indicator available" style={{ marginRight: 6 }} />
          Available ({availableCount})
        </button>
        <button type="button" className={`tab ${filter === 'Tentative' ? 'on' : ''}`} onClick={() => setFilter('Tentative')}>
          <span className="status-indicator tentative" style={{ marginRight: 6 }} />
          Tentative ({tentativeCount})
        </button>
        <button type="button" className={`tab ${filter === 'Unavailable' ? 'on' : ''}`} onClick={() => setFilter('Unavailable')}>
          <span className="status-indicator unavailable" style={{ marginRight: 6 }} />
          Unavailable ({unavailableCount})
        </button>
      </div>

      <Card flush className="list">
        {filtered.map((o) => {
          const statusKey = o.status.toLowerCase();

          return (
            <div className={`office-row ${statusKey}`} key={o.id}>
              <div className="grow">
                <div className="row between wrap" style={{ gap: 8 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.98rem' }}>{o.name}</span>
                    <span className="small faint" style={{ marginLeft: 8 }}>· {o.place}</span>
                  </div>

                  {/* High Visibility Glowing Status Badge */}
                  <div className={`status-pill ${statusKey}`}>
                    <span className={`status-indicator ${statusKey}`} />
                    <span>{o.status}</span>
                  </div>
                </div>

                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className="small muted">
                    {o.note ? `Note: ${o.note}` : (o.status === 'Available' ? 'Currently open for walk-in queries' : 'Check status or book a slot')}
                  </span>
                  <span className="small faint">· Updated {timeAgo(o.updatedAt)}</span>
                </div>

                {o.next && <div className="small faint" style={{ marginTop: 2 }}>Next available window: {o.next}</div>}

                {/* Staff Control Panel: Fast 1-Click Update */}
                {manage ? (
                  <div style={{ marginTop: 12 }}>
                    <div className="small faint" style={{ marginBottom: 6, fontWeight: 500 }}>
                      Quick Status Update (Click to switch):
                    </div>
                    <div className="staff-update-control">
                      {OPTIONS.map((opt) => {
                        const isCurrent = o.status.toLowerCase() === opt.value.toLowerCase();
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            className={`staff-btn btn-${opt.color} ${isCurrent ? 'active' : ''}`}
                            onClick={() => handleUpdateStatus(o.id, o.name, opt.value)}
                          >
                            <span className={`status-indicator ${opt.color}`} />
                            {opt.label}
                            {isCurrent && <Check size={13} style={{ marginLeft: 2 }} />}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        className="staff-btn"
                        style={{ border: '1px dashed var(--border-strong)', color: 'var(--text-2)' }}
                        onClick={() => {
                          setEditingNote(o.id);
                          setNoteText(o.note || '');
                        }}
                      >
                        <Edit2 size={12} /> {o.note ? 'Edit Note' : 'Add Note'}
                      </button>
                    </div>

                    {/* Inline Note Editor for Staff */}
                    {editingNote === o.id && (
                      <div className="row" style={{ marginTop: 8, gap: 8, maxWidth: 420 }}>
                        <input
                          className="input"
                          style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                          placeholder="e.g. Back in 30 mins, in seminar room"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          autoFocus
                        />
                        <button className="btn sm primary" onClick={() => handleSaveNote(o.id, o.name)}>Save</button>
                        <button className="btn sm ghost" onClick={() => setEditingNote(null)}>Cancel</button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Student View Action Buttons */
                  <div className="row" style={{ marginTop: 12, gap: 8 }}>
                    <button
                      type="button"
                      className={`btn sm ${watch.includes(o.id) ? 'primary' : ''}`}
                      onClick={() => toggleWatch(o.id)}
                    >
                      {watch.includes(o.id) ? <BellRing size={14} /> : <Bell size={14} />}
                      {watch.includes(o.id) ? 'Subscribed' : 'Notify on change'}
                    </button>
                    <button type="button" className="btn sm" onClick={() => setBook(o)}>
                      <CalendarPlus size={14} /> Book Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Card>

      {/* Appointment Booking Modal */}
      {book && (
        <Modal title={`Book Appointment · ${book.name}`} onClose={() => setBook(null)}>
          <div className="stack">
            <Field label="Preferred time slot">
              <select className="select" value={slot} onChange={(e) => setSlot(e.target.value)}>
                <option value="">Select a time slot…</option>
                {['Today, 2:30 PM', 'Today, 3:30 PM', 'Today, 4:30 PM', 'Tomorrow, 10:30 AM', 'Tomorrow, 2:00 PM'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Purpose of appointment">
              <textarea
                className="textarea"
                placeholder="State your query, document to sign, or issue..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Field>
            <p className="small faint">
              You will receive a notification if the office updates their availability before your scheduled slot.
            </p>
            <button className="btn primary" onClick={confirm}>Confirm Request</button>
          </div>
        </Modal>
      )}
    </>
  );
}
