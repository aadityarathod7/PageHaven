import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { colors, typography, borderRadius, shadows } from "../styles/theme";
import { toast } from "react-toastify";
import { API_URL } from "../config/config";
import Loader from "../components/Loader";

const PageContainer = styled.div`
  margin-top: 80px;
  padding: 2rem 0 4rem;
`;

const Title = styled.h1`
  color: ${colors.text.primary};
  font-family: ${typography.fonts.heading};
  font-size: 1.75rem;
  font-weight: ${typography.fontWeights.bold};
  margin: 2.5rem 0 2rem;
  text-align: center;
  position: relative;
  padding: 0 1rem;

  &::after {
    content: "";
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: ${colors.secondary};
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 80px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 2rem 0 1.75rem;
  }
`;

const OrderCard = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.sm};
  padding: 1.5rem;
  margin-bottom: 2rem;
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
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.background.accent};
`;

const OrderId = styled.span`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  line-height: 1.6;
`;

const OrderDate = styled.span`
  color: ${colors.text.light};
  font-size: 0.9rem;
  line-height: 1.6;
`;

const BookInfo = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  padding: 0.5rem 0;
`;

const BookCover = styled.img`
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.sm};
`;

const BookDetails = styled.div`
  flex: 1;
  padding: 0.5rem 0;
`;

const BookTitle = styled(Link)`
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeights.semibold};
  text-decoration: none;
  font-size: 1.1rem;
  line-height: 1.6;
  display: inline-block;
  margin-bottom: 0.5rem;

  &:hover {
    color: ${colors.primary};
  }
`;

const OrderDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.background.accent};
`;

const PaymentInfo = styled.div`
  span {
    color: ${colors.text.secondary};
    font-size: 0.9rem;
    line-height: 1.6;
    display: block;

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
`;

const Amount = styled.div`
  font-size: 1.15rem;
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.success};
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${colors.text.secondary};
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.lg};
  margin: 2.5rem 0;

  h3 {
    margin-bottom: 1.25rem;
    color: ${colors.text.primary};
    font-size: 1.25rem;
    font-weight: ${typography.fontWeights.semibold};
  }

  p {
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }
`;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authAxios } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await authAxios.get("/api/orders");
        setOrders(data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authAxios]);

  const getImageUrl = (coverImage) => {
    return coverImage
      ? coverImage.startsWith("http")
        ? coverImage
        : `${API_URL}${coverImage}`
      : `${API_URL}/uploads/default-cover.jpg`;
  };

  const handleImageError = (event) => {
    event.target.src = `${API_URL}/uploads/default-cover.jpg`;
  };

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
                    {order.book ? (
                      <>
                        <BookCover
                          src={getImageUrl(order.book.coverImage)}
                          alt={order.book.title}
                          onError={handleImageError}
                        />
                        <BookDetails>
                          <BookTitle to={`/book/${order.book._id}`}>
                            {order.book.title}
                          </BookTitle>
                        </BookDetails>
                      </>
                    ) : (
                      <BookDetails>
                        <BookTitle as="span">Book not found</BookTitle>
                      </BookDetails>
                    )}
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
