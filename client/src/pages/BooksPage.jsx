import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styled from "styled-components";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import {
  colors,
  typography,
  shadows,
  transitions,
  borderRadius,
} from "../styles/theme";
import { API_URL } from "../config/config";
import { FixedSizeGrid as Grid } from "react-window";
import { useRef } from "react";
import { Container } from "react-bootstrap";

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

const GridWrapper = styled.div`
  width: 100%;
  margin-bottom: 3rem;
`;

const COLUMN_WIDTH = 320; // px
const ROW_HEIGHT = 420; // px
const GUTTER = 32; // px
const MIN_COLUMNS = 1;
const MAX_COLUMNS = 3;

const BooksPage = () => {
  const { pageNumber = 1 } = useParams();
  const gridRef = useRef();

  const {
    data,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books", pageNumber],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/books?pageNumber=${pageNumber}`
      );
      return data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  // Responsive columns
  const getColumnCount = () => {
    if (typeof window === "undefined") return MAX_COLUMNS;
    const width = window.innerWidth;
    if (width < 600) return 1;
    if (width < 1000) return 2;
    return 3;
  };
  const columnCount = getColumnCount();
  const books = data?.books || [];
  const rowCount = Math.ceil(books.length / columnCount);

  // Cell renderer for react-window
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= books.length) return null;
    return (
      <div
        style={{
          ...style,
          left: style.left + GUTTER / 2,
          top: style.top + GUTTER / 2,
          width: style.width - GUTTER,
          height: style.height - GUTTER,
        }}
      >
        <BookCard book={books[index]} />
      </div>
    );
  };

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <h1>All Books</h1>
          <p>Explore our complete collection of books</p>
        </PageHeader>

        {loading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {error?.message || "Error loading books"}
          </Message>
        ) : !data || books.length === 0 ? (
          <Message>No books found</Message>
        ) : (
          <>
            <GridWrapper>
              <Grid
                ref={gridRef}
                columnCount={columnCount}
                columnWidth={COLUMN_WIDTH}
                height={Math.min(ROW_HEIGHT * rowCount, 800)}
                rowCount={rowCount}
                rowHeight={ROW_HEIGHT}
                width={Math.min(
                  COLUMN_WIDTH * columnCount,
                  window.innerWidth - 40
                )}
              >
                {Cell}
              </Grid>
            </GridWrapper>
            <Paginate pages={data.pages} page={data.page} />
          </>
        )}
      </Container>
    </PageContainer>
  );
};

export default BooksPage;
