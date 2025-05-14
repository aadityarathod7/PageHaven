import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  margin-top: 3rem;
  margin-bottom: 3rem;
`;

const StyledCol = styled(Col)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.1), 0 4px 6px -2px rgba(124, 58, 237, 0.05);
  border: 1px solid #e5e7eb;

  form {
    .form-label {
      font-weight: 500;
      color: #4b5563;
    }

    .form-control {
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;

      &:focus {
        border-color: #7C3AED;
        box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.1);
      }
    }

    .btn-primary {
      background-color: #7C3AED;
      border-color: #7C3AED;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        background-color: #6D28D9;
        border-color: #6D28D9;
        transform: translateY(-1px);
      }

      &:focus {
        box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25);
      }
    }
  }
`;

const FormContainer = ({ children }) => {
  return (
    <StyledContainer>
      <Row className="justify-content-md-center">
        <StyledCol xs={12} md={8} lg={6}>
          {children}
        </StyledCol>
      </Row>
    </StyledContainer>
  );
};

export default FormContainer;