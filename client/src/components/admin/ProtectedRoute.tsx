import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { me } from '../../api/adminApi';

export function ProtectedRoute() {
  const [state, setState] = useState<'loading' | 'ok' | 'fail'>('loading');

  useEffect(() => {
    me().then(() => setState('ok')).catch(() => setState('fail'));
  }, []);

  if (state === 'loading') return <div className="page-loading">正在验证登录状态...</div>;
  if (state === 'fail') return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
