import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import {
  colors,
  typography,
  shadows,
  transitions,
  borderRadius,
  gradients,
} from "../styles/theme";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../config/config";
import { commonStyles } from "../styles/theme";

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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  padding: 2rem;
  box-shadow: ${shadows.md};
  border: 1px solid ${colors.background.accent};
  transition: ${transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    border-color: ${colors.secondary}40;
  }
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: 1.5rem;

  label {
    color: ${colors.text.primary};
    font-weight: ${typography.fontWeights.medium};
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  input,
  textarea {
    background: ${colors.background.secondary};
    border: 2px solid ${colors.background.accent};
    color: ${colors.text.primary};
    border-radius: ${borderRadius.lg};
    padding: 0.75rem 1rem;
    transition: ${transitions.default};
    font-size: 0.95rem;

    &:focus {
      background: ${colors.background.primary};
      border-color: ${colors.secondary};
      box-shadow: 0 0 0 3px ${colors.secondary}15;
    }

    &::placeholder {
      color: ${colors.text.light};
    }
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }
`;

const SubmitButton = styled(Button)`
  background: ${gradients.primary};
  border: none;
  padding: 0.75rem 2rem;
  font-weight: ${typography.fontWeights.semibold};
  border-radius: ${borderRadius.lg};
  transition: ${transitions.default};
  box-shadow: ${shadows.md};

  &:hover {
    background: ${gradients.hover};
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  padding: 1.75rem;
  box-shadow: ${shadows.md};
  border: 1px solid ${colors.background.accent};
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  transition: ${transitions.default};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.lg};
    border-color: ${colors.secondary}40;
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${colors.secondary};
    flex-shrink: 0;
  }
`;

const InfoContent = styled.div`
  h3 {
    background: ${gradients.text};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: ${typography.fonts.heading};
    font-size: 1.1rem;
    font-weight: ${typography.fontWeights.semibold};
    margin-bottom: 0.75rem;
  }

  p {
    color: ${colors.text.secondary};
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.7;
  }

  a {
    color: ${colors.text.secondary};
    text-decoration: none;
    transition: ${transitions.default};
    font-size: 0.95rem;

    &:hover {
      color: ${colors.secondary};
    }
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(`${API_URL}/api/contact`, formData);

      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PageContainer>
      <Container>
        <Title>Contact Us</Title>
        <ContactGrid>
          <ContactForm>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </SubmitButton>
            </Form>
          </ContactForm>

          <ContactInfo>
            <InfoCard>
              <FaEnvelope />
              <InfoContent>
                <h3>Email</h3>
                <p>
                  <a href="mailto:aadityarathod7@gmail.com">
                    aadityarathod7@gmail.com
                  </a>
                </p>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <FaPhone />
              <InfoContent>
                <h3>Phone</h3>
                <p>
                  <a href="tel:+919977737801">+91 9977737801</a>
                </p>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <FaMapMarkerAlt />
              <InfoContent>
                <h3>Address</h3>
                <p>
                  New Palasiya
                  <br />
                  Indore, 452001
                  <br />
                  Madhya Pradesh, India
                </p>
              </InfoContent>
            </InfoCard>
          </ContactInfo>
        </ContactGrid>
      </Container>
    </PageContainer>
  );
};

export default Contact;
