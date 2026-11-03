import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Field } from '../../components/ui';
import { BRANCHES, USN_PATTERN, CAMPUS } from '../../data/bmsce';

export default function Register() {
  const { user, register } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', usn: '', email: '', branch: 'CS', sem: 1, password: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (user) return <Navigate to={`/${user.role}`} replace />;

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your full name.';
    if (!USN_PATTERN.test(f.usn.trim())) er.usn = 'USN looks like 1BM24CS001.';
    if (!f.email.toLowerCase().endsWith('@' + CAMPUS.domain)) er.email = `Use your @${CAMPUS.domain} email.`;
    if (f.password.length < 6) er.password = 'At least 6 characters.';
    if (Object.keys(er).length) return setErrors(er);
    const res = register({ ...f, name: f.name.trim(), usn: f.usn.trim().toUpperCase(), sem: Number(f.sem) });
    if (!res.ok) return setErrors({ email: res.error });
    nav('/');
  };

  return (
    <div className="auth">
      <div className="auth-box">
        <div className="brand">
          <div className="brand-mark">U</div>
          <div>
            <div className="brand-name">UniServe</div>
            <div className="brand-sub">BMS College of Engineering</div>
          </div>
        </div>
        <h1>Create account</h1>
        <p className="muted" style={{ marginBottom: 24 }}>For BMSCE students.</p>

        <form className="stack" onSubmit={submit} noValidate>
          <Field label="Full name" error={errors.name}><input className="input" value={f.name} onChange={set('name')} /></Field>
          <Field label="USN" error={errors.usn}><input className="input" value={f.usn} onChange={set('usn')} placeholder="1BM24CS001" /></Field>
          <Field label="College email" error={errors.email}><input className="input" value={f.email} onChange={set('email')} placeholder={`name@${CAMPUS.domain}`} /></Field>
          <div className="grid c2">
            <Field label="Branch">
              <select className="select" value={f.branch} onChange={set('branch')}>
                {BRANCHES.map((b) => <option key={b.code} value={b.code}>{b.code} · {b.name}</option>)}
              </select>
            </Field>
            <Field label="Semester">
              <select className="select" value={f.sem} onChange={set('sem')}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Password" error={errors.password}><input className="input" type="password" value={f.password} onChange={set('password')} /></Field>
          <button className="btn primary block" type="submit">Create account</button>
        </form>
        <p className="small muted" style={{ marginTop: 16 }}>Already registered? <Link className="link" to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
