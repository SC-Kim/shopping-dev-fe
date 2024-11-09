import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { currencyFormat } from "../../../utils/number";

const UserOrderDetailDialog = ({ open, handleClose, order }) => {
    if (!order) return null;  // 주문 정보가 없으면 렌더링하지 않음

    return (
        <Modal show={open} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Order Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>주문번호: {order.orderNum}</p>
                <p>주문 날짜: {order.createdAt.slice(0, 10)}</p>
                <p>총 가격: ₩ {currencyFormat(order.totalPrice)}</p>
                <p>배송 주소: {`${order.shipTo.address}, ${order.shipTo.city}`}</p>
                <p>연락처: {`${order.contact.firstName} ${order.contact.lastName} ${order.contact.contact}`}</p>

                <h5>주문 내역</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>상품 이미지</th>
                            <th>상품명</th>
                            <th>사이즈</th>
                            <th>수량</th>
                            <th>가격</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={`${item.productId._id}-${index}`}> {/* 고유한 key 생성 */}
                                <td>
                                    <img src={item.productId.image} alt={item.productId.name} width={50} />
                                </td>
                                <td>{item.productId.name}</td>
                                <td>{item.size}</td>
                                <td>{item.qty}</td>
                                <td>₩ {currencyFormat(item.qty * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserOrderDetailDialog;