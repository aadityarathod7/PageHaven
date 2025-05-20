import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  colors,
  typography,
  borderRadius,
  shadows,
  gradients,
} from "../styles/theme";

const PageContainer = styled.div`
  margin-top: 80px;
  padding: 2rem 0 4rem;
`;

const PageTitle = styled.h1`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  margin: 2.5rem 0;
  border: 1px solid ${colors.background.accent};
  box-shadow: ${shadows.sm};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
    border-color: ${colors.secondary}40;
  }

  h3 {
    background: ${gradients.text};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.25rem;
    font-size: 1.25rem;
    font-weight: ${typography.fontWeights.semibold};
  }

  p {
    color: ${colors.text.secondary};
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
    line-height: 1.6;
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
      const { data } = await authAxios.get("/api/books/favorites");
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
      setFavorites((prevFavorites) =>
        prevFavorites.filter((book) => book._id !== bookId)
      );
    }
  };

  if (loading) return <Loader />;

  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <PageContainer>
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
                <BookCard book={book} onFavoriteChange={handleFavoriteChange} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </PageContainer>
  );
};

export default FavoritesPage;
