import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styled from "styled-components";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { colors, typography } from "../styles/theme";
import { API_URL } from "../config/config";
import { Container } from "react-bootstrap";

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  margin-top: 5rem;
  h1 {
    font-family: ${typography.fonts.heading};
    color: ${colors.text.primary};
    font-size: 2rem;
    font-weight: ${typography.fontWeights.bold};
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: ${colors.text.secondary};
    max-width: 600px;
  }
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const BooksPage = () => {
  const { pageNumber = 1 } = useParams();

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

  const books = data?.books || [];

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
            <BooksGrid>
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </BooksGrid>
            <Paginate pages={data.pages} page={data.page} />
          </>
        )}
      </Container>
    </PageContainer>
  );
};

export default BooksPage;
