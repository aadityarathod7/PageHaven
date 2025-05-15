import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
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
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: ${colors.text.primary};
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.semibold};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  color: ${colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  color: ${colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 1rem;
  padding-left: 1.5rem;

  li {
    margin-bottom: 0.5rem;
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
            At Book Platform, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website and use our services.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Information We Collect</SectionTitle>
          <List>
            <li>Personal information (name, email address) when you create an account</li>
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
            We implement appropriate security measures to protect your personal information.
            However, no method of transmission over the internet is 100% secure, and we cannot
            guarantee absolute security.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Contact Us</SectionTitle>
          <Text>
            If you have any questions about this Privacy Policy, please contact us at:
            aadityarathod7@gmail.com
          </Text>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default PrivacyPolicy; 