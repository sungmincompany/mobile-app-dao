import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Input, Row, Col } from 'antd';
import './Home.css';

/**
 * VenderInformation 컴포넌트
 * - 컴포넌트가 마운트될 때, 백엔드 API를 호출하여 거래처 데이터를 가져옵니다.
 * - 검색 입력창을 통해 코드 또는 거래처명으로 필터링할 수 있습니다.
 * - 상세주소 버튼을 누르면 Modal 창에 주소가 표시됩니다.
 */
const VenderInformation = () => {
  // API에서 받아온 거래처 데이터를 저장하는 상태
  const [venderData, setVenderData] = useState([]);
  // 필터링된 데이터를 저장하는 상태
  const [filteredData, setFilteredData] = useState([]);
  // 검색어 상태
  const [searchText, setSearchText] = useState('');
  // 모달 창 제어를 위한 상태
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 모달에 표시할 상세 주소
  const [selectedAddress, setSelectedAddress] = useState('');

  // 기본적으로 사용할 업체(스키마) 값 (예: "25_DO")
  const v_db = "25_DO";

  // 컴포넌트 마운트 시 API 호출하여 데이터 가져오기
  useEffect(() => {
    fetch(`/api/select/vender/all?v_db=${v_db}`)
      .then((res) => res.json())
      .then((data) => {
        setVenderData(data);
        setFilteredData(data);
      })
      .catch((err) => console.error("API fetch error:", err));
  }, [v_db]);

  // 상세 주소 모달 표시 함수
  const showAddressModal = (address) => {
    setSelectedAddress(address);
    setIsModalVisible(true);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAddress('');
  };

  // 검색어를 이용하여 데이터 필터링
  const handleSearch = (value) => {
    const lowerValue = value.toLowerCase();
    const filtered = venderData.filter((item) =>
      item.vender_cd.toLowerCase().includes(lowerValue) ||
      item.vender_nm.toLowerCase().includes(lowerValue)
    );
    setFilteredData(filtered);
  };

  // 입력값 변화 시 상태 업데이트 및 검색 처리
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    handleSearch(e.target.value);
  };

  // Ant Design Table의 컬럼 설정
  const columns = [
    {
      title: '코드',
      dataIndex: 'vender_cd',
      key: 'vender_cd',
      align: 'center',
    },
    {
      title: '거래처명',
      dataIndex: 'vender_nm',
      key: 'vender_nm',
      align: 'center',
    },
    {
      title: '도시',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
    },
    {
      title: '상세주소',
      dataIndex: 'address1',
      key: 'address1',
      align: 'center',
      // 주소를 클릭하면 Modal을 띄워 상세 주소를 보여줌
      render: (text) => (
        <Button type="link" onClick={() => showAddressModal(text)} style={{ padding: 0 }}>
          +
        </Button>
      ),
    },
    {
      title: '연락처',
      dataIndex: 'tel',
      key: 'tel',
      align: 'center',
    },
  ];

  return (
    <div className="home-container">
      <div className="status-section">
        <h2>거래처 정보조회</h2>
        {/* 검색 입력 필드 */}
        <Row gutter={10} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Input
              placeholder="코드 또는 거래처명 검색"
              value={searchText}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        {/* Ant Design Table */}
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          size="small"
          bordered={false}
          scroll={{ y: '60vh' }}
          style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: '10px' }}
        />
      </div>
      {/* 상세 주소 Modal */}
      <Modal
        title="상세 주소"
        visible={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            닫기
          </Button>,
        ]}
      >
        <p>{selectedAddress}</p>
      </Modal>
    </div>
  );
};

export default VenderInformation;
