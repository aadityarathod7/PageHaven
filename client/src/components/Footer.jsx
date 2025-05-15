import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { FaBook, FaHeart, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { colors, typography, transitions } from '../styles/theme';

const StyledFooter = styled.footer`
  background: ${colors.background.primary};
  padding: 3rem 0 2rem;
  border-top: 1px solid ${colors.background.accent};
  margin-top: auto;
  font-family: ${typography.fonts.body};
`;

const FooterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FooterTitle = styled.h5`
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeights.semibold};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const FooterLink = styled.a`
  color: ${colors.text.secondary};
  text-decoration: none;
  font-weight: ${typography.fontWeights.medium};
  transition: ${transitions.default};
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  &:hover {
    color: ${colors.secondary};
  }
`;

const FooterText = styled.p`
  color: ${colors.text.secondary};
  margin: 0;
  text-align: center;
  font-size: 0.9rem;
  
  a {
    color: ${colors.secondary};
    text-decoration: none;
    font-weight: ${typography.fontWeights.medium};
    transition: ${transitions.default};
    
    &:hover {
      color: ${colors.primary};
    }
  }
`;

const Divider = styled.hr`
  border-top: 1px solid ${colors.background.accent};
  margin: 1.5rem 0;
`;

const SocialIcon = styled.a`
  color: ${colors.text.secondary};
  margin-right: 1rem;
  transition: ${transitions.default};
  
  &:hover {
    color: ${colors.secondary};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const LogoText = styled.span`
  font-weight: ${typography.fontWeights.semibold};
  font-size: 1.25rem;
  margin-left: 0.5rem;
  color: ${colors.text.primary};
`;

const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <FooterSection>
              <Logo>
                <FaBook size={24} color={colors.secondary} />
                <LogoText>Book Platform</LogoText>
              </Logo>
              <FooterText className="mb-4 text-left">
                Discover, read, and share your favorite books with our community of passionate readers.
              </FooterText>
              <div>
                <SocialIcon href="#" aria-label="Twitter">
                  <FaTwitter size={20} />
                </SocialIcon>
                <SocialIcon href="#" aria-label="Instagram">
                  <FaInstagram size={20} />
                </SocialIcon>
                <SocialIcon href="#" aria-label="Facebook">
                  <FaFacebook size={20} />
                </SocialIcon>
              </div>
            </FooterSection>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <FooterSection>
              <FooterTitle>Explore</FooterTitle>
              <FooterLink href="#">Bestsellers</FooterLink>
              <FooterLink href="#">New Releases</FooterLink>
              <FooterLink href="#">Genres</FooterLink>
              <FooterLink href="#">Authors</FooterLink>
            </FooterSection>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <FooterSection>
              <FooterTitle>Account</FooterTitle>
              <FooterLink href="#">Sign In</FooterLink>
              <FooterLink href="#">Register</FooterLink>
              <FooterLink href="#">My Library</FooterLink>
              <FooterLink href="#">Reading Lists</FooterLink>
            </FooterSection>
          </Col>
          
          <Col lg={4} md={6}>
            <FooterSection>
              <FooterTitle>Support</FooterTitle>
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </FooterSection>
          </Col>
        </Row>
        
        <Divider />
        
        <Row>
          <Col className="py-3">
            <FooterText>
              Book Platform - Aaditya Rathod &copy; {new Date().getFullYear()} - All rights reserved
            </FooterText>
          </Col>
        </Row>
      </Container>
    </StyledFooter>
  );
};

export default Footer;