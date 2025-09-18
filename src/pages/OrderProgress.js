import React, { useState, useEffect } from 'react';
import { DatePicker, Table } from 'antd';
import dayjs from 'dayjs';

const OrderProgress = () => {
  // 1) 주문 목록 데이터 상태
  const [productionData, setProductionData] = useState([]);

  // 2) From/To 날짜 상태 (DatePicker는 dayjs 객체 사용)
  const [fromDt, setFromDt] = useState(dayjs().subtract(1, 'month'));
  const [toDt, setToDt] = useState(dayjs());

  // 3) 스키마(또는 DB 이름) 예시
  const v_db = "25_DO";

  // 4) 주문 조회 함수
  const fetchData = async (fD, tD) => {
    const fromDtParam = fD ? fD.format("YYYYMMDD") : "19990101";
    const toDtParam = tD ? tD.format("YYYYMMDD") : "20991231";

    try {
      const res = await fetch(
        `/api/select/suju/all?v_db=${v_db}&from_dt=${fromDtParam}&to_dt=${toDtParam}`
      );
      if (!res.ok) {
        throw new Error("API response not OK");
      }
      const data = await res.json();
      data.forEach((item) => {
        if (item.suju_dt) {
          item.suju_dt = item.suju_dt.replace(
            /(\d{4})(\d{2})(\d{2})/,
            (_, year, month, day) => `${year.slice(2)}-${month}-${day}`
          );
        }
        if (item.out_dt_to) {
          item.out_dt_to = item.out_dt_to.replace(
            /(\d{4})(\d{2})(\d{2})/,
            (_, year, month, day) => `${year.slice(2)}-${month}-${day}`
          );
        }
      });
      setProductionData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 5) 날짜가 변경될 때마다 자동 조회
  useEffect(() => {
    if (fromDt && toDt && fromDt.isAfter(toDt)) {
      setToDt(fromDt);
      return;
    }
    fetchData(fromDt, toDt);
  }, [fromDt]);

  useEffect(() => {
    if (fromDt && toDt && toDt.isBefore(fromDt)) {
      setFromDt(toDt);
      return;
    }
    fetchData(fromDt, toDt);
  }, [toDt]);

  // 6) 테이블 컬럼 정의 (진행상태: process_cd로 매핑)
  const productionColumns = [
    {
      title: "주문/납기일자",
      key: "dates",
      align: "center",
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{record.suju_dt || ''}</span>
            <span>-----------</span>
            <span>{record.out_dt_to || '미정'}</span>
          </div>
        );
      },
    },
    {
      title: "제품",
      dataIndex: "jepum_nm",
      key: "jepum_nm",
      align: "center",
    },
    {
      title: "거래처",
      dataIndex: "vender_nm",
      key: "vender_nm",
      align: "center",
      width: 65,
    },
    {
      title: "수량",
      dataIndex: "amt",
      key: "amt",
      align: "center",
    },
    {
      title: "진행상태",
      dataIndex: "process_cd",
      key: "process_cd",
      align: "center",
      width: 50,
      render: (code) => {
        let text, color;
        if (code === "01") {
          text = "진행중";
          color = "#e65100"; // 진한 주황색
        } else if (code === "20") {
          text = "완료";
          color = "#2e7d32"; // 진한 녹색
        } else {
          text = code;
          color = "#000";
        }
        return <span style={{ color, fontWeight: 'bold' }}>{text}</span>;
      },
    },
  ];

  // 7) 화면 렌더링: 상단에 "기간검색" 문구와 DatePicker 영역 (한 줄에 ~ 표시)
  return (
    <div style={{ padding: 10 }}>
      <h2>주문생산 진행조회</h2>

      {/* 날짜 선택 영역 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 'bold', fontSize: '16px' }}>
          기간검색
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DatePicker
            value={fromDt}
            onChange={(val) => setFromDt(val)}
            placeholder="시작일"
            format="YYYY-MM-DD"
            allowClear
          />
          <span style={{ margin: '0 8px' }}>~</span>
          <DatePicker
            value={toDt}
            onChange={(val) => setToDt(val)}
            placeholder="종료일"
            format="YYYY-MM-DD"
            allowClear
          />
        </div>
      </div>

      <Table
        dataSource={productionData}
        columns={productionColumns}
        pagination={false}
        size="small"
        bordered={false}
        scroll={{ y: "73vh" }}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          borderRadius: "10px",
        }}
        rowKey="suju_cd"
      />
    </div>
  );
};

export default OrderProgress;
