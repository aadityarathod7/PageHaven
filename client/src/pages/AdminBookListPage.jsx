import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-family: ${typography.fonts.heading};
    color: ${colors.text.primary};
    font-size: 2rem;
    font-weight: ${typography.fontWeights.bold};
    margin: 0;
  }
`;

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.secondary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: ${borderRadius.lg};
  text-decoration: none;
  font-weight: ${typography.fontWeights.semibold};
  transition: ${transitions.default};
  box-shadow: ${shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    background: ${colors.primary};
    color: white;
  }
`;

const TableContainer = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
  overflow: hidden;
  margin-top: 5rem;
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
  width: 36px;
  height: 36px;
  cursor: pointer;

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

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: ${borderRadius.full};
  font-size: 0.75rem;
  font-weight: ${typography.fontWeights.medium};
  background: ${(props) =>
    props.$status === "published"
      ? `${colors.success}15`
      : `${colors.warning}15`};
  color: ${(props) =>
    props.$status === "published" ? colors.success : colors.warning};
`;

const AdminBookListPage = () => {
  const { authAxios } = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await authAxios.get("/api/books/admin/books");
      setBooks(data);
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
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await authAxios.delete(`/api/books/${id}`);
        toast.success("Book deleted successfully");
        fetchBooks();
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
      }
    }
  };

  return (
    <PageContainer>
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
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Reads</th>
                <th>Downloads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.bookId}</td>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>
                    <StatusBadge $status={book.status}>
                      {book.status}
                    </StatusBadge>
                  </td>
                  <td>{book.readCount}</td>
                  <td>{book.downloads}</td>
                  <td>
                    <ActionButton as={Link} to={`/admin/book/${book._id}/edit`}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton
                      onClick={() => deleteHandler(book._id)}
                      $variant="danger"
                      title="Delete Book"
                    >
                      <FaTrash />
                    </ActionButton>
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

export default AdminBookListPage;
