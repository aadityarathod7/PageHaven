import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  background: #F8FAFC;
  padding: 2rem 0;
  border-top: 1px solid #E5E7EB;
  margin-top: auto;
`;

const FooterText = styled.p`
  color: #4B5563;
  margin: 0;
  text-align: center;
  
  a {
    color: #7C3AED;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover {
      color: #6D28D9;
    }
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <Row>
          <Col className='py-3'>
            <FooterText>
              Book Platform &copy; {new Date().getFullYear()} - All rights reserved
            </FooterText>
          </Col>
        </Row>
      </Container>
    </StyledFooter>
  );
};

export default Footer;