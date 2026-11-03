import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, Check, Search, Flag, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, PageHead, Modal, Field, Empty } from '../../components/ui';
import { HELP_CATEGORIES, SERVICE_TYPES, timeAgo } from '../../data/bmsce';

const allServices = Object.entries(SERVICE_TYPES).flatMap(([type, g]) => g.items.map((i) => ({ ...i, type })));

// Shared by students and staff. Staff replies are labelled.
export default function UniHelp() {
  const { user, posts, addPost, votePost, addAnswer, voteAnswer, acceptAnswer, say } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('new');
  const [ask, setAsk] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', category: 'General' });
  const [err, setErr] = useState('');
  const [reply, setReply] = useState('');

  const list = posts
    .filter((p) => (cat === 'All' ? true : p.category === cat))
    .filter((p) => (p.title + p.body).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === 'top' ? b.votes - a.votes : new Date(b.createdAt) - new Date(a.createdAt)));

  // Suggest existing questions while typing the title (search before posting)
  const similar = form.title.trim().length > 3
    ? posts.filter((p) => p.title.toLowerCase().includes(form.title.trim().toLowerCase().split(' ')[0])).slice(0, 3)
    : [];

  const submit = () => {
    if (form.title.trim().length < 8) return setErr('Write a clear question title (at least 8 characters).');
    if (form.body.trim().length < 10) return setErr('Add a few details so others can help.');
    addPost({ title: form.title.trim(), body: form.body.trim(), category: form.category });
    setForm({ title: '', body: '', category: 'General' }); setErr(''); setAsk(false);
    say('Question posted');
  };

  const post = posts.find((p) => p.id === openId);
  const service = post?.suggest ? allServices.find((s) => s.id === post.suggest) : null;
  const base = user.role === 'student' ? '/student' : '/staff';

  return (
    <>
      <PageHead title="UniHelp" sub="Ask the BMSCE community. For official requests, use Services.">
        <button className="btn primary" onClick={() => setAsk(true)}>Ask a question</button>
      </PageHead>

      <div className="row wrap" style={{ marginBottom: 12 }}>
        <div className="search">
          <Search size={15} />
          <input className="input" placeholder="Search questions" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Newest</option>
          <option value="top">Most upvoted</option>
        </select>
      </div>
      <div className="chips" style={{ marginBottom: 20 }}>
        {['All', ...HELP_CATEGORIES].map((c) => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
      </div>

      <Card flush className="list">
        {list.length === 0 ? <Empty text="No questions found. Be the first to ask." /> : list.map((p) => (
          <div className="item click" key={p.id} onClick={() => setOpenId(p.id)} style={{ alignItems: 'flex-start' }}>
            <div className="votes" onClick={(e) => e.stopPropagation()}>
              <button className={p.voted ? 'on' : ''} onClick={() => votePost(p.id)} aria-label="Upvote"><ChevronUp size={18} /></button>
              <span className="small mono">{p.votes}</span>
            </div>
            <div className="grow">
              <div className="title" style={{ whiteSpace: 'normal' }}>{p.title}</div>
              <div className="row small faint wrap" style={{ gap: 8, marginTop: 4 }}>
                <span className="tag">{p.category}</span>
                <span>{p.author}</span><span>· {timeAgo(p.createdAt)}</span>
                <span>· {p.answers.length} {p.answers.length === 1 ? 'answer' : 'answers'}</span>
                {p.accepted && <span className="accepted"><Check size={13} /> Solved</span>}
              </div>
            </div>
          </div>
        ))}
      </Card>

      {ask && (
        <Modal title="Ask a question" onClose={() => setAsk(false)}>
          <div className="stack">
            <Field label="Title">
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What do you need help with?" />
            </Field>
            {similar.length > 0 && (
              <div className="small muted">
                Already asked: {similar.map((s) => <button key={s.id} className="link" style={{ display: 'block' }} onClick={() => { setAsk(false); setOpenId(s.id); }}>{s.title}</button>)}
              </div>
            )}
            <Field label="Category">
              <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {HELP_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Details">
              <textarea className="textarea" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </Field>
            {err && <span className="small" style={{ color: 'var(--bad)' }}>{err}</span>}
            <button className="btn primary" onClick={submit}>Post question</button>
          </div>
        </Modal>
      )}

      {post && (
        <Modal title="Question" onClose={() => { setOpenId(null); setReply(''); }}>
          <div className="stack">
            <div>
              <h3 style={{ fontSize: '1.05rem' }}>{post.title}</h3>
              <div className="small faint" style={{ margin: '4px 0 10px' }}>{post.category} · {post.author} · {timeAgo(post.createdAt)}</div>
              <p className="muted">{post.body}</p>
            </div>

            {service && (
              <Link to={user.role === 'student' ? `/student/services?type=${service.type}` : base} className="btn" onClick={() => setOpenId(null)}>
                Official service: {service.name} <ArrowUpRight size={14} />
              </Link>
            )}

            <h3>{post.answers.length} {post.answers.length === 1 ? 'answer' : 'answers'}</h3>
            <div className="stack" style={{ gap: 14 }}>
              {[...post.answers].sort((a, b) => (b.id === post.accepted) - (a.id === post.accepted) || b.votes - a.votes).map((a) => (
                <div key={a.id} className="row" style={{ alignItems: 'flex-start' }}>
                  <div className="votes">
                    <button className={a.voted ? 'on' : ''} onClick={() => voteAnswer(post.id, a.id)} aria-label="Upvote answer"><ChevronUp size={18} /></button>
                    <span className="small mono">{a.votes}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="small">
                      <strong>{a.author}</strong>{a.role === 'staff' && <span className="tag" style={{ marginLeft: 6 }}>Staff</span>}
                      <span className="faint"> · {timeAgo(a.createdAt)}</span>
                      {post.accepted === a.id && <span className="accepted" style={{ marginLeft: 8 }}><Check size={13} /> Accepted</span>}
                    </div>
                    <p className="muted">{a.text}</p>
                    {post.author === user.name && (
                      <button className="link small" onClick={() => acceptAnswer(post.id, a.id)}>{post.accepted === a.id ? 'Unaccept' : 'Mark as solution'}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Field label="Your answer">
              <textarea className="textarea" value={reply} onChange={(e) => setReply(e.target.value)} />
            </Field>
            <div className="row between">
              <button className="btn ghost sm" onClick={() => say('Reported to moderators')}><Flag size={13} /> Report</button>
              <button className="btn primary" onClick={() => { if (reply.trim().length < 3) return; addAnswer(post.id, reply.trim()); setReply(''); }}>Post answer</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
