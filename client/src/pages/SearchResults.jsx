import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import styled from 'styled-components';
import { colors, typography, shadows, borderRadius, transitions } from '../styles/theme';

const SearchHeader = styled.div`
  margin: 2rem 0;
  text-align: center;
`;

const SearchResults = () => {
  const { query } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/books/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <SearchHeader>
        <h1>Search Results for "{query}"</h1>
        <p>{books.length} books found</p>
      </SearchHeader>

      {books.length === 0 ? (
        <Alert variant="info">
          No books found matching your search. Try different keywords.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {books.map((book) => (
            <Col key={book._id}>
              <BookCard book={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SearchResults; 