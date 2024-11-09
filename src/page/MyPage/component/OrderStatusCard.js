import React from "react";
import { Row, Col, Badge, Button } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderStatusCard = ({ orderItem, onClick}) => {
  return (
    <div onClick={onClick} className="clickable-card"> {/* 클릭 가능하도록 onClick 추가 */}
      <Row className="status-card">
        <Col xs={2}>
          <img
            src={orderItem.items[0]?.productId?.image}
            alt={orderItem.items[0]?.productId?.image}
            height={96}
          />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {orderItem.orderNum}</strong>
          </div>

          <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>

          <div>
            {orderItem.items[0].productId.name}
            {orderItem.items.length > 1 && `외 ${orderItem.items.length - 1}개`}
          </div>
          <div>₩ {currencyFormat(orderItem.totalPrice)}</div>
        </Col>
        <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>

          {/* 구분선 */}
          <div
            style={{
              width: "100%", // 좌우 여백에 맞게 길이 조정
              height: "1px",
              backgroundColor: "#ccc", // 선 색상 설정
              margin: "0.5rem 0", // 위아래 여백
            }}
          ></div>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;
