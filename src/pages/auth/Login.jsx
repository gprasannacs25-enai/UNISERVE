import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Field } from '../../components/ui';

export default function Login() {
  const { user, login } = useApp();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [errors, setErrors] = useState({});
  const [forgot, setForgot] = useState(false);

  if (user) return <Navigate to={`/${user.role}`} replace />;

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!id.trim()) er.id = 'Enter your college email or USN.';
    if (!pw) er.pw = 'Enter your password.';
    if (Object.keys(er).length) return setErrors(er);
    if (!login(id, pw)) return setErrors({ pw: 'Incorrect email/USN or password.' });
    nav('/');
  };

  const fill = (i, p) => { setId(i); setPw(p); setErrors({}); };

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

        <div style={{ marginBottom: 20 }}>
          <span className="badge info" style={{ marginBottom: 10, fontSize: '0.72rem' }}>
            Portal Access · BMSCE
          </span>
          <h1>Sign in</h1>
          <p className="muted small">One platform. Every campus service at your fingertips.</p>
        </div>

        <form className="stack" onSubmit={submit} noValidate>
          <Field label="College email or USN" error={errors.id}>
            <input
              className={`input ${errors.id ? 'invalid' : ''}`}
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. 1BM24CS001"
              autoComplete="username"
            />
          </Field>
          <Field label="Password" error={errors.pw}>
            <input
              className={`input ${errors.pw ? 'invalid' : ''}`}
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <button className="btn primary block" type="submit">Sign in</button>
        </form>

        <div className="row between" style={{ marginTop: 14 }}>
          <button type="button" className="link small" onClick={() => setForgot((f) => !f)}>Forgot password?</button>
          <Link className="link small" to="/register">Create account</Link>
        </div>
        {forgot && (
          <p className="small muted" style={{ marginTop: 10, background: 'var(--accent-soft)', padding: '8px 12px', borderRadius: 8 }}>
            Password reset will be available once the backend is connected. For now, contact the college IT cell.
          </p>
        )}

        <div className="demo">
          <div className="small faint">Quick demo credentials (password: demo123)</div>
          <div className="chips">
            <button type="button" className="chip" onClick={() => fill('1BM24CS001', 'demo123')}>Student</button>
            <button type="button" className="chip" onClick={() => fill('kavitha@bmsce.ac.in', 'demo123')}>Staff</button>
            <button type="button" className="chip" onClick={() => fill('admin@bmsce.ac.in', 'demo123')}>Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}
