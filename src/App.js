// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VenderInformation from './pages/VenderInformation';
import StockInquiry from './pages/StockInquiry';
import OrderRegistration from './pages/OrderRegistration';
import OrderProgress from './pages/OrderProgress';
import StockOutResult from './pages/StockOutResult';
import { Layout } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

const { Header: AntHeader, Sider, Content } = Layout; // Layout 컴포넌트에서 Header, Sider, Content 컴포넌트를 사용

const App = () => {
  const [collapsed, setCollapsed] = useState(false); // 사이드바 접힘 여부

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}> {/* 여백 제거 */}
        <AntHeader style={{ padding: 0, border: 'none', height: '48px' }}>
          <Header collapsed={collapsed} toggleCollapsed={toggleCollapsed} s />
        </AntHeader>

        <Layout>
          <Sider
            collapsed={collapsed}
            width="100vw"  // 전체 너비로 설정
            collapsedWidth="100vw" // 전체 너비로 설정
            style={{ // 사이드바 스타일
              backgroundColor: '#fff',
              position: 'fixed',
              left: 0,
              top: '48px',
              height: '100%',
              zIndex: 10,
              transition: 'transform 0.25s ease', // Smooth slide-in/out
              transform: collapsed ? 'translateX(-100%)' : 'translateX(0)', // 접힐 때 왼쪽으로 이동
            }}
          >
            <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} /> {/* 사이드바 컴포넌트 */}
          </Sider>

          <Content style={{ backgroundColor: 'white' }} >
            <Routes>
              {/* <Route path="/" element={<StockInquiry />} /> */} {/* 기본 페이지 설정 */}

              <Route path="/VenderInformation" element={<VenderInformation />} />
              <Route path="/StockInquiry" element={<StockInquiry />} />
              <Route path="/OrderRegistration" element={<OrderRegistration />} />
              <Route path="/OrderProgress" element={<OrderProgress />} />
              <Route path="/StockOutResult" element={<StockOutResult />} />


            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
