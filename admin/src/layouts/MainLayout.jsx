import React from 'react';
import { Button, Layout, Menu } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Удаляем токен (или другие данные авторизации)
    localStorage.removeItem('tokenHelsey');
    // Редирект на страницу логина
    navigate('/login');
  };

  const menuItems = [
    { label: <Link to="/">Articles</Link>, key: '/' },
    { label: <Link to="/categories">Categories</Link>, key: '/categories' },
    { label: <Link to="/staff">Staff</Link>, key: '/staff' },
    { label: <Link to="/positions">Positions</Link>, key: '/positions' },
    { label: <Link to="/morning-announcements">Morning Announcements</Link>, key: '/morning-announcements' },
    { label: <Link to="/class">Classes</Link>, key: '/class' },
    // { label: <Link to="/authors">Authors</Link>, key: '/authors' },
   
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
<Header  className="bg-white shadow-md  px-6  flex items-center justify-between">
  <h1 className="text-2xl font-semibold text-white">My Admin Panel</h1>
  <img src="/school_logo.png" alt="Helsey" className="h-16" />
  <Button type='primary' onClick={handleLogout}>
      Logout
    </Button>
</Header>


      <Layout>
        <Sider width={200} className="bg-white">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content className="bg-white p-4">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
