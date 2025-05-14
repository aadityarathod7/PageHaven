import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSignInAlt, FaUser, FaLock } from 'react-icons/fa';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { colors, typography, shadows, transitions, borderRadius } from '../styles/theme';

const PageContainer = styled.div`
  min-height: calc(100vh - 140px);
  background: ${colors.background.secondary};
  padding: 4rem 0;
`;

const FormContainer = styled.div`
  max-width: 450px;
  margin: 0 auto;
  padding: 2.5rem;
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;

  h1 {
    font-family: ${typography.fonts.heading};
    font-weight: ${typography.fontWeights.bold};
    color: ${colors.text.primary};
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    color: ${colors.text.secondary};
    font-size: 1.1rem;
    line-height: ${typography.lineHeights.relaxed};
  }
`;

const StyledForm = styled(Form)`
  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    font-weight: ${typography.fontWeights.medium};
    color: ${colors.text.primary};
    margin-bottom: 0.5rem;
  }
`;

const InputGroup = styled.div`
  position: relative;

  input {
    ${props => props.theme.commonStyles?.inputStyle || `
      width: 100%;
      padding: 0.75rem 1rem;
      padding-left: 2.75rem;
      border: 2px solid ${colors.background.accent};
      border-radius: ${borderRadius.lg};
      font-size: 1rem;
      transition: ${transitions.default};
      background: ${colors.background.secondary};
      color: ${colors.text.primary};
      font-family: ${typography.fonts.body};

      &::placeholder {
        color: ${colors.text.light};
      }

      &:focus {
        outline: none;
        border-color: ${colors.secondary};
        background: ${colors.background.primary};
        box-shadow: 0 0 0 4px ${colors.secondary}15;
      }
    `}
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${colors.text.light};
    font-size: 1.1rem;
    pointer-events: none;
    transition: ${transitions.default};
  }

  input:focus + svg {
    color: ${colors.secondary};
  }
`;

const SubmitButton = styled(Button)`
  ${props => props.theme.commonStyles?.buttonStyle || `
    padding: 0.75rem 1.5rem;
    font-weight: ${typography.fontWeights.semibold};
    border-radius: ${borderRadius.lg};
    transition: ${transitions.default};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    &:hover {
      transform: translateY(-1px);
    }
  `}
  width: 100%;
  background: ${colors.secondary};
  border: none;
  font-size: 1.1rem;
  padding: 1rem;

  &:hover {
    background: ${colors.primary};
  }
`;

const RegisterLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: ${colors.text.secondary};
  text-decoration: none;
  font-weight: ${typography.fontWeights.medium};
  transition: ${transitions.default};

  &:hover {
    color: ${colors.secondary};
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useContext(AuthContext);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const submitHandler = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(redirect);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <FormHeader>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </FormHeader>

        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <StyledForm onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <InputGroup>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaUser />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock />
            </InputGroup>
          </Form.Group>

          <SubmitButton type="submit">
            <FaSignInAlt />
            Sign In
          </SubmitButton>
        </StyledForm>

        <RegisterLink to={redirect ? `/register?redirect=${redirect}` : '/register'}>
          Don't have an account? Sign up here
        </RegisterLink>
      </FormContainer>
    </PageContainer>
  );
};

export default LoginPage;