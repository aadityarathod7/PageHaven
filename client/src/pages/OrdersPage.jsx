import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { colors, typography, borderRadius, shadows } from '../styles/theme';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const PageContainer = styled.div`
  padding: 4rem 0;
`;

const Title = styled.h1`
  color: ${colors.text.primary};
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  margin-bottom: 2rem;
  margin-top: 2rem;
  text-align: center;
`;

const OrderCard = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.sm};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${shadows.md};
    transform: translateY(-2px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.background.accent};
`;

const OrderId = styled.span`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
`;

const OrderDate = styled.span`
  color: ${colors.text.light};
  font-size: 0.9rem;
`;

const BookInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BookCover = styled.img`
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: ${borderRadius.md};
`;

const BookDetails = styled.div`
  flex: 1;
`;

const BookTitle = styled(Link)`
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeights.semibold};
  text-decoration: none;
  font-size: 1.1rem;
  
  &:hover {
    color: ${colors.primary};
  }
`;

const OrderDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.background.accent};
`;

const PaymentInfo = styled.div`
  span {
    color: ${colors.text.secondary};
    font-size: 0.9rem;
    display: block;
    
    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
`;

const Amount = styled.div`
  font-size: 1.25rem;
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.success};
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${colors.text.secondary};
  background: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  margin-top: 2rem;

  h3 {
    margin-bottom: 1rem;
    color: ${colors.text.primary};
  }
`;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authAxios } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await authAxios.get('/api/orders');
        setOrders(data);
      } catch (error) {
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authAxios]);

  if (loading) return <Loader />;

  return (
    <PageContainer>
      <Container>
        <Title>My Orders</Title>

        {orders.length === 0 ? (
          <NoOrders>
            <h3>No Orders Yet</h3>
            <p>Your purchased books will appear here</p>
          </NoOrders>
        ) : (
          <Row>
            <Col md={12}>
              {orders.map((order) => (
                <OrderCard key={order._id}>
                  <OrderHeader>
                    <OrderId>Order ID: {order.orderId}</OrderId>
                    <OrderDate>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </OrderDate>
                  </OrderHeader>

                  <BookInfo>
                    <BookCover src={order.book.coverImage} alt={order.book.title} />
                    <BookDetails>
                      <BookTitle to={`/book/${order.book._id}`}>
                        {order.book.title}
                      </BookTitle>
                    </BookDetails>
                  </BookInfo>

                  <OrderDetails>
                    <PaymentInfo>
                      <span>Payment ID: {order.paymentId}</span>
                      <span>Method: {order.paymentMethod}</span>
                    </PaymentInfo>
                    <Amount>₹{(order.amount / 100).toFixed(2)}</Amount>
                  </OrderDetails>
                </OrderCard>
              ))}
            </Col>
          </Row>
        )}
      </Container>
    </PageContainer>
  );
};

export default OrdersPage; 