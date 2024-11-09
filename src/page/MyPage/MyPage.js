import React from "react";
import { useEffect, useState } from "react";
import { Container, Pagination } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import UserOrderDetailDialog from "./component/UserOrderDetailDialog";
import "./style/orderStatus.style.css";
import { getOrder, cancelOrder } from "../../features/order/orderSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList, totalPageNum } = useSelector((state) => state.order);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserOrder, setSelectedUserOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

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

  const openOrderDetail = (order) => {
    setSelectedUserOrder(order);
    setShowDetail(true);
  };

  const closeOrderDetail = () => {
    setShowDetail(false);
    setSelectedUserOrder(null);
  };

  return (
    <Container className="status-card-container">
      {orderList.map((item, index) => (
        <OrderStatusCard
          orderItem={item}
          className="status-card-container"
          // key={item._id}
          key={`${item._id}-${index}-${currentPage}`} // 고유한 key 설정
          onClick={() => openOrderDetail(item)} // 클릭 시 주문 상세 보기
          // onCancel={handleCancelOrder}
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
      {/* 주문 상세 모달 */}
      <UserOrderDetailDialog 
        open={showDetail} 
        handleClose={closeOrderDetail} 
        order={selectedUserOrder} 
        key={selectedUserOrder ? selectedUserOrder._id : "dialog"} // key 설정
        />
    </Container>
  );
};

export default MyPage;
