import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaBook, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import {
  colors,
  typography,
  transitions,
  gradients,
  shadows,
  borderRadius,
} from "../styles/theme";
import { AuthContext } from "../context/AuthContext";
import { memo } from "react";

const StyledFooter = styled.footer`
  background: ${colors.background.secondary};
  padding: 2rem 0 1.5rem;
  border-top: 1px solid ${colors.background.accent};
  font-family: ${typography.fonts.body};
  font-size: 0.95rem;
  color: ${colors.text.secondary};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${gradients.primary};
    opacity: 0.5;
  }
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: ${transitions.default};

  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoText = styled.span`
  background: ${gradients.text};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  font-size: 1.25rem;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${gradients.primary};
  color: white;
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.sm};
  transition: ${transitions.default};

  svg {
    font-size: 1rem;
  }

  &:hover {
    transform: rotate(15deg);
  }
`;

const Socials = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.secondary};
  background: ${colors.background.primary};
  border: 1px solid ${colors.background.accent};
  border-radius: ${borderRadius.lg};
  font-size: 1.1rem;
  transition: ${transitions.default};
  box-shadow: ${shadows.sm};

  &:hover {
    color: white;
    background: ${gradients.primary};
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;

  a {
    color: ${colors.text.secondary};
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: ${typography.fontWeights.medium};
    transition: ${transitions.default};
    position: relative;
    padding: 0.25rem 0;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: ${gradients.primary};
      transition: width 0.3s ease;
    }

    &:hover {
      color: ${colors.secondary};
      transform: translateY(-1px);

      &::after {
        width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    gap: 1.25rem;
  }
`;

const Copyright = styled.div`
  width: 100%;
  text-align: center;
  font-size: 0.85rem;
  color: ${colors.text.light};
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.background.accent};

  a {
    color: ${colors.secondary};
    text-decoration: none;
    transition: ${transitions.default};

    &:hover {
      color: ${colors.primary};
    }
  }
`;

const Footer = () => {
  const { userInfo } = useContext(AuthContext);
  return (
    <StyledFooter>
      <Container>
        <FooterRow>
          <Logo to="/">
            <LogoIcon>
              <FaBook />
            </LogoIcon>
            <LogoText>PageHaven</LogoText>
          </Logo>
          <FooterLinks>
            <Link to="/books">Books</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            {userInfo ? (
              <Link to="/profile">Profile</Link>
            ) : (
              <Link to="/login">Sign In</Link>
            )}
          </FooterLinks>
          <Socials>
            <SocialIcon
              href="https://twitter.com/aadityarathod7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </SocialIcon>
            <SocialIcon
              href="https://instagram.com/aadityarathod7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </SocialIcon>
            <SocialIcon
              href="https://www.facebook.com/share/1AaQ57ENMC/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </SocialIcon>
          </Socials>
        </FooterRow>
        <Copyright>
          &copy; {new Date().getFullYear()} PageHaven &mdash; Created by{" "}
          <a
            href="https://github.com/aadityarathod7"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aaditya Rathod
          </a>
        </Copyright>
      </Container>
    </StyledFooter>
  );
};

export default memo(Footer);
