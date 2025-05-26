import React, { useEffect, useState, useContext } from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  colors,
  typography,
  borderRadius,
  shadows,
  gradients,
} from "../styles/theme";
import { toast } from "react-toastify";
import { API_URL } from "../config/config";
import { FaBook, FaDownload } from "react-icons/fa";
import Loader from "../components/Loader";

const PageContainer = styled.div`
  padding: 2rem 0;
  margin-top: 80px;
`;

const Title = styled.h1`
  background: ${gradients.text};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: ${typography.fonts.heading};
  font-size: 1.75rem;
  font-weight: ${typography.fontWeights.bold};
  margin: 2.5rem 0 2rem;
  text-align: center;
  position: relative;
  padding: 0 1rem;

  &::after {
    content: "";
    position: absolute;
    bottom: -12px;
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
    margin: 2rem 0 1.75rem;
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
  border: 1px solid ${colors.background.accent};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.md};
    border-color: ${colors.secondary}40;
  }
`;

const BookCover = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const BookInfo = styled.div`
  padding: 1.5rem;
`;

const BookTitle = styled.h3`
  color: ${colors.text.primary};
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.semibold};
  margin: 0 0 1rem;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;

  @media (max-width: 320px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: ${typography.fontWeights.medium};
  text-decoration: none;
  color: white;
  background: ${(props) =>
    props.$variant === "secondary" ? gradients.hover : gradients.primary};
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  white-space: nowrap;
  min-width: 0;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    opacity: 0.9;
    color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 320px) {
    width: 100%;
  }
`;

const NoBooks = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${colors.text.secondary};
  background: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  margin: 2.5rem auto;
  max-width: 600px;
  border: 1px solid ${colors.background.accent};
  box-shadow: ${shadows.sm};

  h3 {
    margin: 1rem 0 1.25rem;
    color: ${colors.text.primary};
    font-size: 1.25rem;
    font-weight: ${typography.fontWeights.semibold};
  }

  p {
    font-size: 0.95rem;
    margin: 0 0 1.5rem;
    line-height: 1.6;
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
