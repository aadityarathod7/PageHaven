import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { FaCheck, FaTimes, FaTrash, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  colors,
  typography,
  shadows,
  transitions,
  borderRadius,
} from "../styles/theme";

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-family: ${typography.fonts.heading};
    color: ${colors.text.primary};
    font-size: 2rem;
    font-weight: ${typography.fontWeights.bold};
    margin: 0;
  }
`;

const TableContainer = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: ${colors.background.secondary};
    color: ${colors.text.primary};
    font-weight: ${typography.fontWeights.semibold};
    padding: 1.25rem 1rem;
    text-align: left;
    border-bottom: 2px solid ${colors.background.accent};
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  td {
    padding: 1.25rem 1rem;
    vertical-align: middle;
    color: ${colors.text.secondary};
    border-bottom: 1px solid ${colors.background.accent};

    a {
      color: ${colors.text.primary};
      text-decoration: none;
      transition: ${transitions.default};

      &:hover {
        color: ${colors.secondary};
      }
    }
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const ActionButton = styled.button`
  padding: 0.625rem;
  border-radius: ${borderRadius.lg};
  color: ${(props) =>
    props.$variant === "danger" ? colors.danger : colors.secondary};
  background: ${colors.background.accent};
  border: none;
  margin-right: 0.75rem;
  transition: ${transitions.default};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${(props) => (props.$hasText ? "120px" : "36px")};
  height: 36px;
  cursor: pointer;
  gap: 0.5rem;
  font-weight: ${typography.fontWeights.medium};
  font-size: 0.875rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
    background: ${(props) =>
      props.$variant === "danger" ? colors.danger : colors.secondary};
    color: white;
  }

  svg {
    font-size: 1rem;
  }
`;

const StatusIcon = styled.span`
  color: ${(props) => (props.isAdmin ? colors.success : colors.accent)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AdminUserListPage = () => {
  const { authAxios, userInfo } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await authAxios.get("/api/users");
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    // Prevent deleting self
    if (id === userInfo._id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await authAxios.delete(`/api/users/${id}`);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
      }
    }
  };

  // This would require an endpoint that doesn't exist in our implementation yet
  const makeAdminHandler = async (id) => {
    try {
      await authAxios.put(`/api/users/${id}`, { role: "admin" });
      toast.success("User updated to admin role");
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <h1>Users</h1>
      </PageHeader>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    <StatusIcon isAdmin={user.role === "admin"}>
                      {user.role === "admin" ? <FaCheck /> : <FaTimes />}
                    </StatusIcon>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user._id !== userInfo._id && (
                      <>
                        {user.role !== "admin" && (
                          <ActionButton
                            hasText
                            onClick={() => makeAdminHandler(user._id)}
                          >
                            <FaUserShield />
                            Make Admin
                          </ActionButton>
                        )}
                        <ActionButton
                          variant="danger"
                          onClick={() => deleteHandler(user._id)}
                        >
                          <FaTrash />
                        </ActionButton>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}
    </PageContainer>
  );
};

export default AdminUserListPage;
