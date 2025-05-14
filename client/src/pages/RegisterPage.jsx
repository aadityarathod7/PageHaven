import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
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
  max-width: 480px;
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

const StyledForm = styled.form`
  .form-group {
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-weight: ${typography.fontWeights.medium};
    color: ${colors.text.primary};
    margin-bottom: 0.5rem;
  }
`;

const InputGroup = styled.div`
  position: relative;

  input {
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

const SubmitButton = styled.button`
  width: 100%;
  background: ${colors.secondary};
  color: white;
  border: none;
  font-size: 1.1rem;
  padding: 1rem;
  border-radius: ${borderRadius.lg};
  font-weight: ${typography.fontWeights.semibold};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: ${transitions.default};
  cursor: pointer;

  &:hover {
    background: ${colors.primary};
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${colors.text.light};
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const LoginLink = styled(Link)`
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

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? location.search.split('=')[1] : '/';

  const { register, userInfo, loading } = useContext(AuthContext);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await register(name, email, password);
      toast.success('Registration successful');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <FormHeader>
          <h1>Create Account</h1>
          <p>Join our community of book lovers</p>
        </FormHeader>

        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <StyledForm onSubmit={submitHandler}>
          <FormGroup>
            <label htmlFor="name">Full Name</label>
            <InputGroup>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <FaUser />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <label htmlFor="email">Email Address</label>
            <InputGroup>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaEnvelope />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <label htmlFor="password">Password</label>
            <InputGroup>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <InputGroup>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FaLock />
            </InputGroup>
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            <FaUserPlus />
            {loading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </StyledForm>

        <LoginLink to={redirect ? `/login?redirect=${redirect}` : '/login'}>
          Already have an account? Sign in here
        </LoginLink>
      </FormContainer>
    </PageContainer>
  );
};

export default RegisterPage;