import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import { colors, typography } from '../styles/theme';

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

const OrderSummary = styled.div`
  background: ${colors.background.primary};
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  max-width: 500px;
  margin: 0 auto 2rem auto;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.background.accent};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookId, amount, bookTitle } = location.state || {};

  useEffect(() => {
    if (!bookId || !amount || !bookTitle) {
      navigate('/');
    }
  }, [bookId, amount, bookTitle, navigate]);

  if (!bookId || !amount || !bookTitle) {
    return null;
  }

  const handlePaymentSuccess = (paymentDetails) => {
    navigate('/payment-success', { 
      state: { 
        paymentId: paymentDetails.id,
        amount: paymentDetails.amount,
        bookId,
        bookTitle
      } 
    });
  };

  return (
    <PageContainer>
      <Container>
        <Title>Checkout</Title>
        
        <OrderSummary>
          <OrderItem>
            <span>Book:</span>
            <span>{bookTitle}</span>
          </OrderItem>
          <OrderItem>
            <span>Price:</span>
            <span>₹{(amount / 100).toFixed(2)}</span>
          </OrderItem>
        </OrderSummary>

        <PaymentForm 
          amount={amount}
          bookTitle={bookTitle}
          bookId={bookId}
          onSuccess={handlePaymentSuccess}
        />
      </Container>
    </PageContainer>
  );
};

export default CheckoutPage; 