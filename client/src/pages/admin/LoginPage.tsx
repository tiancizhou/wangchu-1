import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/adminApi';

export function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123456');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    }
  }

  return <main className="login-page"><form onSubmit={onSubmit} className="login-card"><h1>官网后台登录</h1><input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="账号" /><input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" type="password" />{error && <p className="error">{error}</p>}<button>登录</button></form></main>;
}
