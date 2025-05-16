import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaBook } from 'react-icons/fa';
import { colors, typography, shadows, borderRadius } from '../styles/theme';

const PageContainer = styled.div`
  padding: 4rem 0;
`;

const SuccessCard = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
  text-align: center;
`;

const Icon = styled.div`
  color: ${colors.success};
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  color: ${colors.text.primary};
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  margin-bottom: 1rem;
  margin-top: 5rem;
`;

const Message = styled.p`
  color: ${colors.text.secondary};
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const Details = styled.div`
  background: ${colors.background.secondary};
  padding: 1.5rem;
  border-radius: ${borderRadius.lg};
  margin-bottom: 2rem;
`;

const DetailItem = styled.p`
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
  
  strong {
    color: ${colors.text.primary};
    font-weight: ${typography.fontWeights.semibold};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const StyledButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-weight: ${typography.fontWeights.medium};
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const PaymentSuccessPage = () => {
  const location = useLocation();
  const { paymentId, amount, bookId, bookTitle } = location.state || {};

  return (
    <PageContainer>
      <Container>
        <SuccessCard>
          <Icon>
            <FaCheckCircle />
          </Icon>
          <Title>Payment Successful!</Title>
          <Message>
            Thank you for your purchase. You now have access to read and download the book.
          </Message>
          
          <Details>
            <DetailItem>
              <strong>Book:</strong> {bookTitle}
            </DetailItem>
            <DetailItem>
              <strong>Amount Paid:</strong> ₹{(amount / 100).toFixed(2)}
            </DetailItem>
            <DetailItem>
              <strong>Payment ID:</strong> {paymentId}
            </DetailItem>
          </Details>

          <ButtonGroup>
            <StyledButton 
              as={Link} 
              to={`/read/${bookId}`} 
              variant="primary"
            >
              <FaBook /> Start Reading
            </StyledButton>
            
            <StyledButton 
              as={Link} 
              to="/books" 
              variant="outline-primary"
            >
              Browse More Books
            </StyledButton>
          </ButtonGroup>
        </SuccessCard>
      </Container>
    </PageContainer>
  );
};

export default PaymentSuccessPage; 