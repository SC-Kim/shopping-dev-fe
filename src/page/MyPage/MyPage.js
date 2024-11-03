import React from "react";
import { useEffect, useState } from "react";
import { Container, Pagination } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList, totalPageNum } = useSelector((state) => state.order);
  const [currentPage, setCurrentPage] = useState(1);

  // console.log("ordrList??:" ,orderList);
  useEffect(() => {
    dispatch(getOrder(currentPage));
  }, [dispatch, currentPage]);

  if (orderList?.length === 0) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }

  // 페이지네이션 클릭 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);  // 현재 페이지 업데이트
  };

  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard
          orderItem={item}
          className="status-card-container"
          key={item._id}
        />
      ))}
      {/* 페이지네이션 UI */}
      <Pagination className="justify-content-center mt-4">
        {[...Array(totalPageNum)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default MyPage;
