import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBook, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { colors, typography, transitions } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { memo } from 'react';

const StyledFooter = styled.footer`
  background: ${colors.background.secondary};
  padding: 1.2rem 0 0.7rem;
  border-top: 1px solid ${colors.background.accent};
  font-family: ${typography.fonts.body};
  font-size: 0.92rem;
  color: ${colors.text.secondary};
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.2rem;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`;

const LogoText = styled.span`
  font-weight: ${typography.fontWeights.semibold};
  font-size: 1.1rem;
  color: ${colors.text.primary};
`;

const Socials = styled.div`
  display: flex;
  gap: 0.7rem;
`;

const SocialIcon = styled.a`
  color: ${colors.text.secondary};
  font-size: 1.1rem;
  transition: ${transitions.default};
  &:hover {
    color: ${colors.secondary};
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  a {
    color: ${colors.text.secondary};
    text-decoration: none;
    font-size: 0.92rem;
    transition: ${transitions.default};
    &:hover {
      color: ${colors.secondary};
      text-decoration: underline;
    }
  }
`;

const Copyright = styled.div`
  width: 100%;
  text-align: center;
  font-size: 0.85rem;
  color: ${colors.text.light};
  margin-top: 0.5rem;
`;

const Footer = () => {
  const { userInfo } = useContext(AuthContext);
  return (
    <StyledFooter>
      <Container>
        <FooterRow>
          <Logo to="/">
            <FaBook size={18} color={colors.secondary} />
            <LogoText>PageHaven</LogoText>
          </Logo>
          <FooterLinks>
            <Link to="/books">Books</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            {userInfo ? (
              <Link to="/profile">Profile</Link>
            ) : (
              <Link to="/login">Sign In</Link>
            )}
          </FooterLinks>
          <Socials>
            <SocialIcon href="https://twitter.com/aadityarathod7" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </SocialIcon>
            <SocialIcon href="https://instagram.com/aadityarathod7" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href="https://facebook.com/aadityarathod7" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </SocialIcon>
          </Socials>
        </FooterRow>
        <Copyright>
          &copy; {new Date().getFullYear()} PageHaven &mdash; Aaditya Rathod
        </Copyright>
      </Container>
    </StyledFooter>
  );
};

export default memo(Footer);