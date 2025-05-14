// client/src/components/Header.jsx
import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaUser, FaBook, FaSignOutAlt, FaCog, FaList, FaUsers, FaPlus } from 'react-icons/fa';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { colors, typography, shadows, transitions, borderRadius } from '../styles/theme';

const StyledNavbar = styled(Navbar)`
  background: ${colors.background.primary};
  padding: 1rem 0;
  border-bottom: 1px solid ${colors.background.accent};
`;

const Brand = styled(Navbar.Brand)`
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  font-size: 1.5rem;
  color: ${colors.text.primary} !important;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: ${colors.secondary};
  }
`;

const NavLink = styled(Nav.Link)`
  color: ${colors.text.secondary} !important;
  font-weight: ${typography.fontWeights.medium};
  padding: 0.5rem 1rem !important;
  border-radius: ${borderRadius.lg};
  transition: ${transitions.default};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${colors.text.primary} !important;
    background: ${colors.background.secondary};
  }

  &.active {
    color: ${colors.secondary} !important;
    background: ${colors.background.secondary};
  }

  svg {
    font-size: 1.1rem;
  }
`;

const StyledDropdown = styled(NavDropdown)`
  .dropdown-toggle {
    color: ${colors.text.secondary} !important;
    font-weight: ${typography.fontWeights.medium};
    padding: 0.5rem 1rem !important;
    border-radius: ${borderRadius.lg};
    transition: ${transitions.default};
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      color: ${colors.text.primary} !important;
      background: ${colors.background.secondary};
    }

    &::after {
      margin-left: 0.5rem;
    }
  }

  .dropdown-menu {
    border: 1px solid ${colors.background.accent};
    border-radius: ${borderRadius.lg};
    box-shadow: ${shadows.lg};
    padding: 0.5rem;
    min-width: 200px;
    margin-top: 0.5rem;
  }

  .dropdown-item {
    color: ${colors.text.secondary};
    font-weight: ${typography.fontWeights.medium};
    padding: 0.75rem 1rem;
    border-radius: ${borderRadius.md};
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: ${transitions.default};

    svg {
      font-size: 1.1rem;
      color: ${colors.text.light};
    }

    &:hover {
      color: ${colors.text.primary};
      background: ${colors.background.secondary};

      svg {
        color: ${colors.secondary};
      }
    }

    &:active {
      background: ${colors.background.accent};
    }
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.full};
  background: ${colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.secondary};
  margin-right: 0.5rem;
`;

const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);

  return (
    <StyledNavbar expand="lg">
      <Container>
        <LinkContainer to="/">
          <Brand>
            <FaBook /> BookStore
          </Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {userInfo ? (
              <>
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
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>
                      <FaUser />
                      Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  {userInfo.role === 'admin' && (
                    <>
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>
                          <FaCog />
                          Dashboard
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/books">
                        <NavDropdown.Item>
                          <FaList />
                          Manage Books
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/book/create">
                        <NavDropdown.Item>
                          <FaPlus />
                          Add New Book
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>
                          <FaUsers />
                          Manage Users
                        </NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>
                    <FaSignOutAlt />
                    Logout
                  </NavDropdown.Item>
                </StyledDropdown>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <NavLink>
                    <FaUser />
                    Sign In
                  </NavLink>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;