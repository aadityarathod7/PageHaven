import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { colors, typography, borderRadius, shadows } from '../styles/theme';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FaArrowLeft } from 'react-icons/fa';

const PageContainer = styled.div`
  padding: 4rem 0;
`;

const Title = styled.h1`
  color: ${colors.text.primary};
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  margin-bottom: 2rem;
  text-align: center;
`;

const StyledTable = styled(Table)`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.sm};
  margin-top: 2rem;

  th, td {
    vertical-align: middle;
  }

  th {
    background: ${colors.background.secondary};
    color: ${colors.text.primary};
    font-weight: ${typography.fontWeights.semibold};
  }
`;

const BookInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BookCover = styled.img`
  width: 50px;
  height: 75px;
  object-fit: cover;
  border-radius: ${borderRadius.sm};
`;

const BookTitle = styled(Link)`
  color: ${colors.text.primary};
  text-decoration: none;
  font-weight: ${typography.fontWeights.medium};

  &:hover {
    color: ${colors.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  span {
    &:first-child {
      color: ${colors.text.primary};
      font-weight: ${typography.fontWeights.medium};
    }

    &:last-child {
      color: ${colors.text.secondary};
      font-size: 0.9rem;
    }
  }
`;

const Amount = styled.span`
  color: ${colors.success};
  font-weight: ${typography.fontWeights.semibold};
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.text.secondary};
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.primary};
  }
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

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authAxios } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await authAxios.get('/api/orders/admin');
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
        <BackButton to="/admin/dashboard">
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
        
        <Title>All Orders</Title>

        {orders.length === 0 ? (
          <NoOrders>
            <h3>No Orders Yet</h3>
            <p>There are no orders in the system</p>
          </NoOrders>
        ) : (
          <StyledTable responsive hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Book</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>
                    <BookInfo>
                      <BookCover src={order.book.coverImage} alt={order.book.title} />
                      <BookTitle to={`/book/${order.book._id}`}>
                        {order.book.title}
                      </BookTitle>
                    </BookInfo>
                  </td>
                  <td>
                    <UserInfo>
                      <span>{order.user.name}</span>
                      <span>{order.user.email}</span>
                    </UserInfo>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Amount>₹{(order.amount / 100).toFixed(2)}</Amount>
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span style={{ 
                      color: order.status === 'completed' ? colors.success : colors.warning 
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        )}
      </Container>
    </PageContainer>
  );
};

export default AdminOrdersPage; 