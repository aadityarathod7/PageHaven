import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Form } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  colors,
  typography,
  shadows,
  transitions,
  borderRadius,
} from "../styles/theme";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${colors.background.primary} 0%,
    ${colors.background.secondary} 100%
  );
  padding: 2rem;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${colors.background.primary}CC;
  backdrop-filter: blur(10px);
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.xl};
  padding: 2rem 2rem;
  animation: ${fadeIn} 0.6s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-family: ${typography.fonts.heading};
    font-weight: ${typography.fontWeights.bold};
    color: ${colors.text.primary};
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: ${colors.text.secondary};
    font-size: 1rem;
    line-height: ${typography.lineHeights.relaxed};
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1rem;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: ${colors.background.secondary}80;
    border: 2px solid ${colors.background.accent};
    border-radius: ${borderRadius.lg};
    color: ${colors.text.primary};
    font-size: 0.95rem;
    transition: ${transitions.default};

    &::placeholder {
      color: ${colors.text.light};
    }

    &:focus {
      outline: none;
      border-color: ${colors.secondary};
      background: ${colors.background.secondary};
      box-shadow: 0 0 0 4px ${colors.secondary}15;
    }
  }

  svg {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${colors.text.light};
    font-size: 1rem;
    pointer-events: none;
    transition: ${transitions.default};
  }

  input:focus + svg {
    color: ${colors.secondary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, ${colors.secondary}, ${colors.primary});
  color: white;
  border: none;
  border-radius: ${borderRadius.lg};
  font-weight: ${typography.fontWeights.semibold};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: ${transitions.default};
  margin-top: 1.5rem;
  box-shadow: ${shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 1rem;
  }
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1.25rem;
  color: ${colors.text.secondary};
  text-decoration: none;
  font-weight: ${typography.fontWeights.medium};
  font-size: 0.95rem;
  transition: ${transitions.default};

  &:hover {
    color: ${colors.secondary};
  }
`;

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const { register, userInfo, loading } = useContext(AuthContext);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(name, email, password);
      toast.success("Registration successful");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <FormHeader>
          <h2>Create Account</h2>
          <p>Join our community of book lovers</p>
        </FormHeader>

        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FaUser />
          </InputGroup>

          <InputGroup>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope />
          </InputGroup>

          <InputGroup>
            <Form.Control
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock />
          </InputGroup>

          <InputGroup>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FaLock />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            <FaUserPlus />
            {loading ? "Creating Account..." : "Create Account"}
          </SubmitButton>
        </Form>

        <LoginLink to={redirect ? `/login?redirect=${redirect}` : "/login"}>
          Already have an account? Sign in here
        </LoginLink>
      </FormContainer>
    </PageContainer>
  );
};

export default RegisterPage;
