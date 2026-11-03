import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  DEMO_USERS, SEED_REQUESTS, SEED_POSTS, SEED_AVAILABILITY, SEED_NOTIFICATIONS, SERVICE_TYPES,
} from '../data/bmsce';

// Frontend-only store backed by localStorage. Replace with API calls when the backend is ready.
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => load('us_users', DEMO_USERS));
  const [user, setUser] = useState(() => load('us_session', null));
  const [requests, setRequests] = useState(() => load('us_requests', SEED_REQUESTS));
  const [posts, setPosts] = useState(() => load('us_posts', SEED_POSTS));
  const [availability, setAvailability] = useState(() => load('us_avail', SEED_AVAILABILITY));
  const [notifications, setNotifications] = useState(() => load('us_notifs', SEED_NOTIFICATIONS));
  const [toast, setToast] = useState('');

  useEffect(() => { try { localStorage.setItem('us_users', JSON.stringify(users)); } catch { /* ignore */ } }, [users]);
  useEffect(() => { try { localStorage.setItem('us_session', JSON.stringify(user)); } catch { /* ignore */ } }, [user]);
  useEffect(() => { try { localStorage.setItem('us_requests', JSON.stringify(requests)); } catch { /* ignore */ } }, [requests]);
  useEffect(() => { try { localStorage.setItem('us_posts', JSON.stringify(posts)); } catch { /* ignore */ } }, [posts]);
  useEffect(() => { try { localStorage.setItem('us_avail', JSON.stringify(availability)); } catch { /* ignore */ } }, [availability]);
  useEffect(() => { try { localStorage.setItem('us_notifs', JSON.stringify(notifications)); } catch { /* ignore */ } }, [notifications]);

  const say = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  }, []);

  const notify = (userId, text) =>
    setNotifications((n) => [{ id: 'n' + Date.now() + Math.random(), userId, text, at: new Date().toISOString(), read: false }, ...n]);

  /* ---------- auth ---------- */
  const login = (identifier, password) => {
    const id = identifier.trim().toLowerCase();
    const found = users.find((u) => (u.email.toLowerCase() === id || (u.usn && u.usn.toLowerCase() === id)) && u.password === password);
    if (!found) return false;
    setUser(found);
    return true;
  };
  const register = (data) => {
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase() || u.usn?.toLowerCase() === data.usn.toLowerCase())) {
      return { ok: false, error: 'An account with this email or USN already exists.' };
    }
    const u = { id: 'u' + Date.now(), role: 'student', ...data };
    setUsers((x) => [...x, u]);
    setUser(u);
    return { ok: true };
  };
  const logout = () => setUser(null);

  /* ---------- requests ---------- */
  const createRequest = ({ type, item, details, location }) => {
    const svc = SERVICE_TYPES[type].items.find((i) => i.id === item);
    const now = new Date().toISOString();
    const req = {
      id: 'UNI-' + (1046 + requests.length), type, item, title: svc.name, dept: svc.dept,
      studentId: user.id, studentName: user.name, usn: user.usn, details, location,
      status: 'Submitted', createdAt: now, assignee: null, comments: [],
      timeline: [{ s: 'Submitted', at: now }, { s: 'Assigned', at: now }],
    };
    req.status = 'Assigned';
    setRequests((r) => [req, ...r]);
    notify(user.id, `${req.id} submitted and sent to the department.`);
    return req;
  };

  const updateRequest = (id, { status, comment, assignee, dept }) => {
    const now = new Date().toISOString();
    let target;
    setRequests((rs) => rs.map((r) => {
      if (r.id !== id) return r;
      const next = { ...r };
      if (status && status !== r.status) {
        next.status = status;
        next.timeline = [...r.timeline, { s: status, at: now }];
      }
      if (comment) next.comments = [...r.comments, { by: user.name, text: comment, at: now }];
      if (assignee !== undefined) next.assignee = assignee;
      if (dept) next.dept = dept;
      target = next;
      return next;
    }));
    const r = requests.find((x) => x.id === id);
    if (r && status && status !== r.status) notify(r.studentId, `${id} is now ${status.toLowerCase()}.`);
    else if (r && comment) notify(r.studentId, `New comment on ${id}.`);
    return target;
  };

  /* ---------- UniHelp ---------- */
  const addPost = (p) =>
    setPosts((ps) => [{ id: 'p' + Date.now(), author: user.name, role: user.role, createdAt: new Date().toISOString(), votes: 0, voted: false, accepted: null, answers: [], suggest: null, ...p }, ...ps]);
  const votePost = (id) =>
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, voted: !p.voted, votes: p.votes + (p.voted ? -1 : 1) } : p)));
  const addAnswer = (postId, text) =>
    setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, answers: [...p.answers, { id: 'a' + Date.now(), author: user.name, role: user.role, votes: 0, voted: false, createdAt: new Date().toISOString(), text }] } : p)));
  const voteAnswer = (postId, aId) =>
    setPosts((ps) => ps.map((p) => (p.id !== postId ? p : { ...p, answers: p.answers.map((a) => (a.id === aId ? { ...a, voted: !a.voted, votes: a.votes + (a.voted ? -1 : 1) } : a)) })));
  const acceptAnswer = (postId, aId) =>
    setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, accepted: p.accepted === aId ? null : aId } : p)));

  /* ---------- availability ---------- */
  const setOffice = (id, patch) =>
    setAvailability((a) => a.map((o) => (o.id === id ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o)));

  /* ---------- notifications ---------- */
  const markAllRead = () => setNotifications((n) => n.map((x) => (x.userId === user?.id ? { ...x, read: true } : x)));

  const resetDemo = () => {
    ['us_users', 'us_requests', 'us_posts', 'us_avail', 'us_notifs'].forEach((k) => localStorage.removeItem(k));
    setUsers(DEMO_USERS); setRequests(SEED_REQUESTS); setPosts(SEED_POSTS);
    setAvailability(SEED_AVAILABILITY); setNotifications(SEED_NOTIFICATIONS);
    say('Demo data reset');
  };

  const value = {
    user, users, login, register, logout,
    requests, createRequest, updateRequest,
    posts, addPost, votePost, addAnswer, voteAnswer, acceptAnswer,
    availability, setOffice,
    notifications: notifications.filter((n) => n.userId === user?.id), markAllRead,
    say, resetDemo,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </Ctx.Provider>
  );
}
