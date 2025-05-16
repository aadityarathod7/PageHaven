import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaBook } from 'react-icons/fa';
import { colors, typography, shadows, borderRadius } from '../styles/theme';

const PageContainer = styled.div`
  padding: 2rem 0;
`;

const SuccessCard = styled.div`
  max-width: 350px;
  padding: 1.5rem;
  margin-left: 25rem;
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
  text-align: center;
  margin-top: 6rem;
`;

const Icon = styled.div`
  color: ${colors.success};
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: ${colors.text.primary};
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
`;

const Message = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
`;

const Details = styled.div`
  background: ${colors.background.secondary};
  padding: 1rem;
  border-radius: ${borderRadius.lg};
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
`;

const DetailItem = styled.p`
  color: ${colors.text.secondary};
  margin-bottom: 0.35rem;
  
  strong {
    color: ${colors.text.primary};
    font-weight: ${typography.fontWeights.semibold};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const StyledButton = styled(Button)`
  padding: 0.6rem 1.25rem;
  font-size: 0.9rem;
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