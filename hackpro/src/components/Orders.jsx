import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

const OrdersContainer = styled.div`
  max-width: 1000px;
  margin: 100px auto 50px;
  padding: 30px;
`;

const OrdersHeader = styled.h1`
  color: #ff4081;
  text-align: center;
  margin-bottom: 30px;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: #555;
`;

const OrderDate = styled.span`
  color: #777;
`;

const OrderStatus = styled.span`
  color: ${props => 
    props.status === 'Delivered' ? '#4CAF50' : 
    props.status === 'Cancelled' ? '#F44336' : '#FFC107'};
  font-weight: 600;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`;

const ItemName = styled.span`
  font-weight: 500;
`;

const ItemPrice = styled.span`
  color: #ff4081;
`;

const OrderTotal = styled.div`
  text-align: right;
  font-weight: 600;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 50px;
  color: #777;
  font-size: 18px;
`;

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8885/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <OrdersContainer>
      <OrdersHeader>My Orders</OrdersHeader>
      {orders.length > 0 ? (
        orders.map(order => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <OrderId>Order #{order.orderNumber}</OrderId>
              <OrderDate>
                {new Date(order.createdAt).toLocaleDateString()}
              </OrderDate>
              <OrderStatus status={order.status}>
                {order.status}
              </OrderStatus>
            </OrderHeader>
            {order.items.map(item => (
              <OrderItem key={item._id}>
                <ItemName>
                  {item.name} × {item.quantity}
                </ItemName>
                <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
              </OrderItem>
            ))}
            <OrderTotal>Total: ${order.total.toFixed(2)}</OrderTotal>
          </OrderCard>
        ))
      ) : (
        <NoOrders>You haven't placed any orders yet.</NoOrders>
      )}
    </OrdersContainer>
  );
};

export default Orders;