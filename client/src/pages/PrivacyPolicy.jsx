import React from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import {
  colors,
  typography,
  shadows,
  borderRadius,
  gradients,
} from "../styles/theme";

const PageContainer = styled.div`
  padding: 4rem 0;
  margin-top: 80px;
`;

const Title = styled.h1`
  background: ${gradients.text};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
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
`;

const Section = styled.section`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${shadows.md};
  border: 1px solid ${colors.background.accent};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    border-color: ${colors.secondary}40;
  }
`;

const SectionTitle = styled.h2`
  background: ${gradients.text};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.semibold};
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
`;

const Text = styled.p`
  color: ${colors.text.secondary};
  line-height: 1.7;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
`;

const List = styled.ul`
  color: ${colors.text.secondary};
  line-height: 1.7;
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
  font-size: 0.95rem;

  li {
    margin-bottom: 0.75rem;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: -1.5rem;
      top: 0.5rem;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${colors.secondary};
    }
  }
`;

const PrivacyPolicy = () => {
  return (
    <PageContainer>
      <Container>
        <Title>Privacy Policy</Title>

        <Section>
          <SectionTitle>Introduction</SectionTitle>
          <Text>
            At Book Platform, we take your privacy seriously. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website and use our services.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Information We Collect</SectionTitle>
          <List>
            <li>
              Personal information (name, email address) when you create an
              account
            </li>
            <li>Reading preferences and history</li>
            <li>Device and browser information</li>
            <li>Usage data and interaction with our services</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>How We Use Your Information</SectionTitle>
          <List>
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To personalize your reading experience</li>
            <li>To improve our service</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>Data Security</SectionTitle>
          <Text>
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the internet is
            100% secure, and we cannot guarantee absolute security.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Contact Us</SectionTitle>
          <Text>
            If you have any questions about this Privacy Policy, please contact
            us at: aadityarathod7@gmail.com
          </Text>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default PrivacyPolicy;
