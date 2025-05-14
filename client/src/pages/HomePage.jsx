import { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import styled from 'styled-components';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

// Color palette
const colors = {
  primary: '#2D3047', // Deep blue-gray
  secondary: '#419D78', // Forest green
  text: {
    primary: '#2D3047',
    secondary: '#516170',
    light: '#94A3B8'
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    accent: '#E2E8F0'
  },
  accent: '#E63946' // Accent red for special elements
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.primary};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const HeroSection = styled.div`
  padding: 6rem 0;
  background: ${colors.background.primary};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, ${colors.background.accent}, transparent);
  }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  h1 {
    font-size: 4.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 2rem;
    color: ${colors.text.primary};
    letter-spacing: -0.03em;
    font-family: 'Fraunces', serif;

    span {
      color: ${colors.secondary};
    }

    @media (max-width: 992px) {
      font-size: 3rem;
    }
  }

  p {
    font-size: 1.25rem;
    color: ${colors.text.secondary};
    margin-bottom: 3rem;
    line-height: 1.7;
    font-weight: 400;
    letter-spacing: -0.01em;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 500px;

  @media (max-width: 992px) {
    margin: 0 auto;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.5rem;
  padding-right: 4rem;
  border: 2px solid ${colors.background.accent};
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 400;
  transition: all 0.2s ease;
  background: ${colors.background.secondary};
  color: ${colors.text.primary};

  &::placeholder {
    color: ${colors.text.light};
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: ${colors.secondary};
    background: ${colors.background.primary};
    box-shadow: 0 0 0 4px ${colors.secondary}15;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: ${colors.secondary};
  color: white;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primary};
    transform: translateY(-50%) scale(1.05);
  }
`;

const HeroImage = styled.div`
  position: relative;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 24px;
    box-shadow: 0 20px 25px -5px rgba(45, 48, 71, 0.1), 
                0 10px 10px -5px rgba(45, 48, 71, 0.04);
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

const FeaturedSection = styled.div`
  padding: 6rem 0;
  background: ${colors.background.secondary};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0;
  font-family: 'Fraunces', serif;
  letter-spacing: -0.02em;
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.secondary};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.primary};
    gap: 0.75rem;
  }
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const HomePage = () => {
  const { keyword = '', pageNumber = 1 } = useParams();
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/books?keyword=${keyword}&pageNumber=${pageNumber}`
        );
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
  }, [keyword, pageNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <PageContainer>
      <HeroSection>
        <Container>
          <HeroGrid>
            <HeroContent>
              <h1>Find your next <span>favorite</span> book</h1>
              <p>
                Discover thousands of books to read, from bestsellers to hidden gems. 
                Start your reading journey today.
              </p>
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Search by title, author, or genre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchButton>
                  <FaSearch />
                </SearchButton>
              </SearchContainer>
            </HeroContent>
            <HeroImage>
              <img 
                src="/hero-books.jpg" 
                alt="Collection of books"
              />
            </HeroImage>
          </HeroGrid>
        </Container>
      </HeroSection>

      <FeaturedSection>
        <Container>
          <SectionHeader>
            <SectionTitle>Featured Books</SectionTitle>
            <ViewAllLink to="/books">
              View all books <FaArrowRight />
            </ViewAllLink>
          </SectionHeader>

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
              <Paginate
                pages={pages}
                page={page}
                keyword={keyword}
              />
            </>
          )}
        </Container>
      </FeaturedSection>
    </PageContainer>
  );
};

export default HomePage;