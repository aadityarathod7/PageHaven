import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { colors, typography, borderRadius, shadows } from "../styles/theme";
import { toast } from "react-toastify";
import { API_URL } from "../config/config";
import { FaBook, FaDownload } from "react-icons/fa";
import Loader from "../components/Loader";

const PageContainer = styled.div`
  padding: 2rem 0;
  margin-top: 80px; /* Add space below navbar */
`;

const Title = styled.h1`
  color: ${colors.text.primary};
  font-family: ${typography.fonts.heading};
  font-size: 1.75rem;
  font-weight: ${typography.fontWeights.bold};
  margin: 2.5rem 0 2rem; /* Increased margin top and bottom */
  text-align: center;
  position: relative;
  padding: 0 1rem; /* Added horizontal padding */

  &::after {
    content: "";
    position: absolute;
    bottom: -12px; /* Increased space for underline */
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

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 2rem 0 1.75rem; /* Adjusted margins for mobile */
  }
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const BookCard = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.sm};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.md};
  }
`;

const BookCover = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const BookInfo = styled.div`
  padding: 1rem;
`;

const BookTitle = styled.h3`
  color: ${colors.text.primary};
  font-size: 1rem;
  font-weight: ${typography.fontWeights.semibold};
  margin: 1rem 0 0.75rem; /* Increased margins */
  padding: 0 0.5rem; /* Added horizontal padding */
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${borderRadius.md};
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.medium};
  text-decoration: none;
  color: white;
  background: ${(props) =>
    props.$variant === "secondary" ? colors.secondary : colors.primary};
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    color: white;
    transform: translateY(-2px);
  }
`;

const NoBooks = styled.div`
  text-align: center;
  padding: 3rem 2rem; /* Increased vertical padding */
  color: ${colors.text.secondary};
  background: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  margin: 2.5rem auto; /* Increased margins */
  max-width: 600px;

  h3 {
    margin: 1rem 0 1.25rem; /* Increased margins */
    color: ${colors.text.primary};
    font-size: 1.25rem;
    padding: 0.5rem 0; /* Added vertical padding */
  }

  p {
    font-size: 0.95rem;
    margin: 0 0 1.5rem; /* Increased bottom margin */
    line-height: 1.6; /* Added line height for better readability */
  }
`;

const PurchasedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authAxios } = useContext(AuthContext);

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        const { data } = await authAxios.get("/api/orders/purchased-books");
        console.log("Purchased Books API response:", data);
        setBooks(Array.isArray(data) ? data : data.books || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch purchased books"
        );
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedBooks();
  }, [authAxios]);

  const getImageUrl = (coverImage) => {
    return coverImage
      ? coverImage.startsWith("http")
        ? coverImage
        : `${API_URL}${coverImage}`
      : `${API_URL}/uploads/default-cover.jpg`;
  };

  if (loading) return <Loader />;

  return (
    <PageContainer>
      <Container>
        <Title>My Books</Title>

        {Array.isArray(books) && books.length === 0 ? (
          <NoBooks>
            <h3>No Books Yet</h3>
            <p>
              Books you purchase will appear here for reading and downloading
            </p>
            <ActionButton to="/books" $variant="secondary">
              Browse Books
            </ActionButton>
          </NoBooks>
        ) : (
          <BooksGrid>
            {Array.isArray(books) &&
              books.map((book) => (
                <BookCard key={book._id}>
                  <BookCover
                    src={getImageUrl(book.coverImage)}
                    alt={book.title}
                  />
                  <BookInfo>
                    <BookTitle>{book.title}</BookTitle>
                    <ButtonGroup>
                      <ActionButton to={`/read/${book._id}`}>
                        <FaBook /> Read Now
                      </ActionButton>
                      <ActionButton
                        to={`/book/${book._id}`}
                        $variant="secondary"
                      >
                        <FaDownload /> Download
                      </ActionButton>
                    </ButtonGroup>
                  </BookInfo>
                </BookCard>
              ))}
          </BooksGrid>
        )}
      </Container>
    </PageContainer>
  );
};

export default PurchasedBooks;
