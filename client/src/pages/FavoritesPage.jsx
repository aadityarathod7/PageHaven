import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { colors, typography } from '../styles/theme';

const PageTitle = styled.h1`
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text.primary};
  margin: 2rem 0;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: ${colors.background.secondary};
  border-radius: 1rem;
  margin: 2rem 0;

  h3 {
    color: ${colors.text.primary};
    margin-bottom: 1rem;
  }

  p {
    color: ${colors.text.secondary};
    margin-bottom: 0;
  }
`;

const FavoritesPage = () => {
  const { authAxios } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data } = await authAxios.get('/api/books/favorites');
      setFavorites(data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [authAxios]);

  const handleFavoriteChange = (bookId, isFavorite) => {
    if (!isFavorite) {
      // If book is unfavorited, remove it from the list
      setFavorites(prevFavorites => prevFavorites.filter(book => book._id !== bookId));
    }
  };

  if (loading) return <Loader />;

  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <Container>
      <PageTitle>My Favorite Books</PageTitle>
      
      {favorites.length === 0 ? (
        <EmptyState>
          <h3>No Favorite Books Yet</h3>
          <p>Books you mark as favorites will appear here</p>
        </EmptyState>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {favorites.map((book) => (
            <Col key={book._id}>
              <BookCard 
                book={book} 
                onFavoriteChange={handleFavoriteChange}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default FavoritesPage; 