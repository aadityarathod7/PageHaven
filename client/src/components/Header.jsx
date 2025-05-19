// client/src/components/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBook, FaSignOutAlt, FaCog, FaList, FaUsers, FaPlus, FaSearch, FaHeart, FaBell, FaShoppingBag } from 'react-icons/fa';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { colors, typography, shadows, transitions, borderRadius } from '../styles/theme';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const StyledNavbar = styled(Navbar)`
  background: ${colors.background.primary}80;
  padding: 1.25rem 0;
  border-bottom: 1px solid ${colors.background.accent}40;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: ${transitions.default};

  &.scrolled {
    background: ${colors.background.primary}cc;
    padding: 1rem 0;
    box-shadow: ${shadows.lg};
    border-bottom: 1px solid ${colors.background.accent}80;
  }

  @supports not (backdrop-filter: blur(10px)) {
    background: ${colors.background.primary}f8;
  }
`;

const Brand = styled(Navbar.Brand)`
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  font-size: 1.75rem;
  color: ${colors.text.primary} !important;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: ${transitions.default};

  svg {
    color: ${colors.secondary};
    font-size: 1.5rem;
    transition: ${transitions.default};
  }

  &:hover {
    transform: translateY(-1px);
    
    svg {
      transform: scale(1.1) rotate(-5deg);
      color: ${colors.primary};
    }
  }
`;

const NavLink = styled(Nav.Link)`
  color: ${colors.text.secondary} !important;
  font-weight: ${typography.fontWeights.medium};
  padding: 0.75rem 1.25rem !important;
  border-radius: ${borderRadius.lg};
  transition: ${transitions.default};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  margin: 0 0.25rem;

  &:hover {
    color: ${colors.text.primary} !important;
    background: ${colors.background.secondary};
    transform: translateY(-1px);
  }

  &.active {
    color: ${colors.secondary} !important;
    background: ${colors.background.secondary};

    &:before {
      content: '';
      position: absolute;
      bottom: 0.5rem;
      left: 1.25rem;
      right: 1.25rem;
      height: 2px;
      background: ${colors.secondary};
      border-radius: ${borderRadius.full};
      transform: scaleX(0);
      animation: slideIn 0.3s ease forwards;
    }
  }

  svg {
    font-size: 1.2rem;
    transition: ${transitions.default};
  }

  @keyframes slideIn {
    to {
      transform: scaleX(1);
    }
  }
`;

const StyledDropdown = styled(NavDropdown)`
  .dropdown-toggle {
    color: ${colors.text.secondary} !important;
    font-weight: ${typography.fontWeights.medium};
    padding: 0.75rem 1.25rem !important;
    border-radius: ${borderRadius.lg};
    transition: ${transitions.default};
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0.25rem;

    &:hover {
      color: ${colors.text.primary} !important;
      background: ${colors.background.secondary};
      transform: translateY(-1px);
    }

    &::after {
      margin-left: 0.5rem;
      transition: ${transitions.default};
    }

    &[aria-expanded="true"] {
      color: ${colors.secondary} !important;
      background: ${colors.background.secondary};

      &::after {
        transform: rotate(180deg);
      }
    }
  }

  .dropdown-menu {
    border: 1px solid ${colors.background.accent};
    border-radius: ${borderRadius.xl};
    box-shadow: ${shadows.xl};
    padding: 0.75rem;
    min-width: 220px;
    margin-top: 0.75rem;
    animation: dropdownFade 0.2s ease;
    background: ${colors.background.primary}f8;
    backdrop-filter: blur(10px);

    @keyframes dropdownFade {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .dropdown-item {
    color: ${colors.text.secondary};
    font-weight: ${typography.fontWeights.medium};
    padding: 0.875rem 1.25rem;
    border-radius: ${borderRadius.lg};
    display: flex;
    align-items: center;
    gap: 0.875rem;
    transition: ${transitions.default};
    position: relative;
    overflow: hidden;

    svg {
      font-size: 1.2rem;
      color: ${colors.text.light};
      transition: ${transitions.default};
    }

    &:hover {
      color: ${colors.text.primary};
      background: ${colors.background.secondary};
      transform: translateX(4px);

      svg {
        color: ${colors.secondary};
        transform: scale(1.1);
      }
    }

    &:active {
      background: ${colors.background.accent};
    }
  }
`;

const UserAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${borderRadius.full};
  background: ${colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.secondary};
  margin-right: 0.75rem;
  transition: ${transitions.default};
  border: 2px solid transparent;

  svg {
    font-size: 1.2rem;
    transition: ${transitions.default};
  }

  ${StyledDropdown}:hover & {
    border-color: ${colors.secondary}40;
    background: ${colors.background.accent};
    
    svg {
      transform: scale(1.1);
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  margin: 0 1.5rem;

  @media (max-width: 992px) {
    width: 100%;
    margin: 1rem 0;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.75rem;
  border: 2px solid ${colors.background.accent};
  border-radius: ${borderRadius.full};
  background: ${colors.background.secondary};
  color: ${colors.text.primary};
  font-size: 0.95rem;
  transition: ${transitions.default};

  &::placeholder {
    color: ${colors.text.light};
  }

  &:focus {
    outline: none;
    border-color: ${colors.secondary};
    background: ${colors.background.primary};
    box-shadow: 0 0 0 4px ${colors.secondary}15;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.text.light};
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: ${transitions.default};

  ${SearchInput}:focus + & {
    color: ${colors.secondary};
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 1rem;

  @media (max-width: 992px) {
    margin: 1rem 0;
    justify-content: center;
  }
`;

const IconButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: ${colors.text.secondary};
  width: 40px;
  height: 40px;
  border-radius: ${borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transitions.default};
  cursor: pointer;

  svg {
    font-size: 1.2rem;
    transition: ${transitions.default};
  }

  &:hover {
    background: ${colors.background.secondary};
    color: ${colors.secondary};
    transform: translateY(-2px);
  }

  .notification-dot {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    background: ${colors.accent};
    border-radius: 50%;
    border: 2px solid ${colors.background.primary};
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications] = useState(true);

  // Check if we're on login or signup pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
    }
  };

  return (
    <StyledNavbar expand="lg" className={scrolled ? 'scrolled' : ''}>
      <Container>
        <LinkContainer to="/">
          <Brand>
            <FaBook /> PageHaven
          </Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {!isAuthPage && (
            <Form onSubmit={handleSearch} className="d-flex flex-grow-1 mx-lg-4">
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon>
                  <FaSearch />
                </SearchIcon>
              </SearchContainer>
            </Form>
          )}

          {userInfo && (
            <NavIcons>
              <IconButton 
                title="Favorites"
                onClick={() => navigate('/favorites')}
              >
                <FaHeart />
              </IconButton>
              <IconButton title="Notifications">
                <FaBell />
                {hasNotifications && <div className="notification-dot" />}
              </IconButton>
            </NavIcons>
          )}

          <Nav>
            {userInfo ? (
              <StyledDropdown
                title={
                  <span className="d-flex align-items-center">
                    <UserAvatar>
                      <FaUser />
                    </UserAvatar>
                    {userInfo.name}
                  </span>
                }
                id="username"
              >
                <NavDropdown.Item as={Link} to="/my-books">
                  <FaBook /> My Books
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">
                  <FaShoppingBag /> My Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/favorites">
                  <FaHeart /> Favorites
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">
                  <FaUser /> Profile
                </NavDropdown.Item>
                {userInfo.role === 'admin' && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      <FaCog /> Admin Dashboard
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  <FaSignOutAlt />
                  Logout
                </NavDropdown.Item>
              </StyledDropdown>
            ) : !isAuthPage && (
              <LinkContainer to="/login">
                <NavLink>
                  <FaUser />
                  Sign In
                </NavLink>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default memo(Header);