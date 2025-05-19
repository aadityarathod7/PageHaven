import React, { useState, useEffect, useRef } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import styled from 'styled-components';
import { colors, typography, shadows, borderRadius, transitions } from '../styles/theme';
import { API_URL } from '../config/config';
import { FixedSizeGrid as Grid } from 'react-window';

const SearchHeader = styled.div`
  margin: 2rem 0;
  text-align: center;
`;

const GridWrapper = styled.div`
  width: 100%;
  margin-bottom: 3rem;
`;

const COLUMN_WIDTH = 320; // px
const ROW_HEIGHT = 420; // px
const GUTTER = 32; // px
const MIN_COLUMNS = 1;
const MAX_COLUMNS = 3;

const SearchResults = () => {
  const { query } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/books/search?query=${encodeURIComponent(query)}`);
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

  // Responsive columns
  const getColumnCount = () => {
    if (typeof window === 'undefined') return MAX_COLUMNS;
    const width = window.innerWidth;
    if (width < 600) return 1;
    if (width < 1000) return 2;
    return 3;
  };
  const columnCount = getColumnCount();
  const rowCount = Math.ceil(books.length / columnCount);

  // Cell renderer for react-window
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= books.length) return null;
    return (
      <div style={{ ...style, left: style.left + GUTTER / 2, top: style.top + GUTTER / 2, width: style.width - GUTTER, height: style.height - GUTTER }}>
        <BookCard book={books[index]} />
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Loader />
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
        <GridWrapper>
          <Grid
            ref={gridRef}
            columnCount={columnCount}
            columnWidth={COLUMN_WIDTH}
            height={Math.min(ROW_HEIGHT * rowCount, 800)}
            rowCount={rowCount}
            rowHeight={ROW_HEIGHT}
            width={Math.min(COLUMN_WIDTH * columnCount, window.innerWidth - 40)}
          >
            {Cell}
          </Grid>
        </GridWrapper>
      )}
    </Container>
  );
};

export default SearchResults; 