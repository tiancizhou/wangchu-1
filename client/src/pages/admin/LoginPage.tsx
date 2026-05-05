import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/adminApi';

type LoginValues = {
  username: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();

  async function onSubmit(values: LoginValues) {
    try {
      await login(values.username, values.password);
      message.success('登录成功');
      navigate('/admin');
    } catch (err) {
      message.error(err instanceof Error ? err.message : '登录失败');
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'linear-gradient(135deg, #eef4ff 0%, #f8fafc 50%, #edf7ff 100%)' }}>
      <Card style={{ width: '100%', maxWidth: 420, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.12)' }}>
        <Typography.Title level={3} style={{ marginTop: 0, textAlign: 'center' }}>官网后台登录</Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center' }}>请输入管理员账号和密码进入管理后台。</Typography.Paragraph>
        <Form layout="vertical" initialValues={{ username: 'admin', password: 'admin123456' }} onFinish={onSubmit}>
          <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
            <Input prefix={<UserOutlined />} placeholder="账号" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">登录</Button>
        </Form>
      </Card>
    </main>
  );
}
