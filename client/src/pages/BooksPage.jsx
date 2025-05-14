import { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { colors, typography, shadows, transitions, borderRadius } from '../styles/theme';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 8rem 0 4rem;
  background: ${colors.background.primary};
`;

const PageHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;

  h1 {
    font-size: 3rem;
    font-weight: ${typography.fontWeights.bold};
    color: ${colors.text.primary};
    margin-bottom: 1rem;
    font-family: ${typography.fonts.heading};
  }

  p {
    font-size: 1.2rem;
    color: ${colors.text.secondary};
    max-width: 600px;
    margin: 0 auto;
  }
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const BooksPage = () => {
  const { pageNumber = 1 } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/books?pageNumber=${pageNumber}`);
        setBooks(data.books);
        setPage(data.page);
        setPages(data.pages);
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

    fetchBooks();
  }, [pageNumber]);

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <h1>All Books</h1>
          <p>Explore our complete collection of books</p>
        </PageHeader>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : books.length === 0 ? (
          <Message>No books found</Message>
        ) : (
          <>
            <BookGrid>
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </BookGrid>
            <Paginate pages={pages} page={page} />
          </>
        )}
      </Container>
    </PageContainer>
  );
};

export default BooksPage; 