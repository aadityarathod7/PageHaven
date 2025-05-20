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

const Terms = () => {
  return (
    <PageContainer>
      <Container>
        <Title>Terms and Conditions</Title>

        <Section>
          <SectionTitle>Agreement to Terms</SectionTitle>
          <Text>
            By accessing and using Book Platform, you agree to be bound by these
            Terms and Conditions and our Privacy Policy. If you disagree with
            any part of these terms, you may not access the service.
          </Text>
        </Section>

        <Section>
          <SectionTitle>User Accounts</SectionTitle>
          <List>
            <li>You must be at least 13 years old to use this service</li>
            <li>
              You are responsible for maintaining the security of your account
            </li>
            <li>You are responsible for all activities under your account</li>
            <li>
              You must notify us of any security breach or unauthorized use
            </li>
          </List>
        </Section>

        <Section>
          <SectionTitle>Intellectual Property</SectionTitle>
          <Text>
            The service and its original content, features, and functionality
            are owned by Book Platform and are protected by international
            copyright, trademark, patent, trade secret, and other intellectual
            property laws.
          </Text>
        </Section>

        <Section>
          <SectionTitle>User Content</SectionTitle>
          <Text>
            Users retain their rights to any content they submit, post, or
            display on or through the service. By submitting content, you grant
            us the right to use, modify, publicly perform, publicly display,
            reproduce, and distribute such content on and through the service.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Termination</SectionTitle>
          <Text>
            We may terminate or suspend your account and bar access to the
            service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever, including but not
            limited to a breach of the Terms.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Contact Us</SectionTitle>
          <Text>
            If you have any questions about these Terms, please contact us at:
            aadityarathod7@gmail.com
          </Text>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default Terms;
