// src/components/Sidebar.js
import React from 'react';
import { Menu } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ toggleCollapsed }) => {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
    toggleCollapsed(); // 메뉴 클릭 시 사이드바 접기
  };

  const items = [
    {
      key: '1',
      icon: <EditOutlined />,
      label: '거래처 정보조회',
      onClick: () => handleMenuClick('/VenderInformation'),
    },
    {
      key: '2',
      icon: <EditOutlined />,
      label: '재고조회',
      onClick: () => handleMenuClick('/StockInquiry'),
    },
    {
      key: '3',
      icon: <EditOutlined />,
      label: '주문등록',
      onClick: () => handleMenuClick('/OrderRegistration'),
    },
    {
      key: '4',
      icon: <EditOutlined />,
      label: '주문생산 진행조회',
      onClick: () => handleMenuClick('/OrderProgress'),
    },
    {
      key: '5',
      icon: <EditOutlined />,
      label: '출고결과등록',
      onClick: () => handleMenuClick('/StockOutResult'),
    },
  ];

  return <Menu theme="light" mode="inline" items={items} />;
};

export default Sidebar;
