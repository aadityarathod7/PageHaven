import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { commonStyles, colors } from "../styles/theme";

const StyledContainer = styled(Container)`
  margin-top: 3rem;
  margin-bottom: 3rem;
`;

const StyledCol = styled(Col)`
  ${commonStyles.cardStyle}
  padding: 2rem;

  form {
    .form-label {
      font-weight: 500;
      color: ${colors.text.primary};
    }
    .form-control {
      border-radius: 1.5rem;
      border: 2px solid ${colors.background.accent};
      padding: 0.75rem 1rem;
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      background: #fff;
      color: ${colors.text.primary};
      font-family: "Poppins", "Inter", sans-serif;
      &:focus {
        border-color: ${colors.secondary};
        box-shadow: 0 0 0 0.2rem ${colors.secondary}25;
      }
    }
    .btn-primary {
      background: linear-gradient(
        135deg,
        ${colors.secondary},
        ${colors.primary}
      );
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 1.5rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      color: #fff;
      &:hover {
        background: linear-gradient(
          135deg,
          ${colors.primary},
          ${colors.secondary}
        );
        transform: translateY(-1px);
      }
      &:focus {
        box-shadow: 0 0 0 0.2rem ${colors.primary}25;
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
