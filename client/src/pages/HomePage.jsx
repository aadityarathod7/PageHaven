import { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaArrowRight, FaBook, FaStar, FaUserFriends } from 'react-icons/fa';
import styled from 'styled-components';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { colors, typography, shadows, transitions, borderRadius } from '../styles/theme';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.primary};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const HeroSection = styled.div`
  padding: 8rem 0;
  background: linear-gradient(135deg, ${colors.primary}dd, ${colors.secondary}dd),
              url('/hero-books.jpg') center/cover no-repeat;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23FFFFFF' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 6rem 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  color: white;

  h1 {
    font-size: 4rem;
    font-weight: ${typography.fontWeights.extrabold};
    line-height: 1.1;
    margin-bottom: 1.5rem;
    font-family: ${typography.fonts.heading};
    letter-spacing: -0.02em;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.35rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: ${typography.lineHeights.relaxed};
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards 0.2s;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SearchBox = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards 0.4s;
  box-shadow: ${shadows.lg};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.5rem 1.75rem;
  font-size: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.full};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  transition: ${transitions.default};
  padding-right: 4rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: ${colors.secondary};
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${transitions.default};

  &:hover {
    background: ${colors.primary};
    transform: translateY(-50%) scale(1.05);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 4rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards 0.6s;

  @media (max-width: 768px) {
    gap: 2rem;
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${colors.secondary};
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 2.5rem;
    font-weight: ${typography.fontWeights.bold};
    font-family: ${typography.fonts.heading};
    line-height: 1;
    background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: ${typography.fontWeights.medium};
  }

  @media (max-width: 768px) {
    .value {
      font-size: 2rem;
    }
  }
`;

const FeaturedSection = styled.section`
  padding: 4rem 0;
  background: var(--background-color);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    color: var(--primary-hover);
  }

  svg {
    transition: var(--transition);
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HomePage = () => {
  const { keyword = '', pageNumber = 1 } = useParams();
  const navigate = useNavigate();
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(keyword);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/books?limit=4');
        setBooks(data.books);
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
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <PageContainer>
      <HeroSection>
        <Container>
          <HeroContent>
            <h1>Discover Your Next Great Read</h1>
            <p>
              Explore our vast collection of books, from timeless classics to contemporary bestsellers.
              Your next literary adventure awaits.
            </p>
            <SearchBox>
              <SearchInput
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              />
              <SearchButton onClick={handleSearch}>
                <FaSearch />
              </SearchButton>
            </SearchBox>
            <Stats>
              <StatItem>
                <FaBook />
                <span className="value">10,000+</span>
                <span className="label">Books</span>
              </StatItem>
              <StatItem>
                <FaUserFriends />
                <span className="value">50,000+</span>
                <span className="label">Readers</span>
              </StatItem>
              <StatItem>
                <FaStar />
                <span className="value">4.8</span>
                <span className="label">Rating</span>
              </StatItem>
            </Stats>
          </HeroContent>
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
            <BookGrid>
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </BookGrid>
          )}
        </Container>
      </FeaturedSection>
    </PageContainer>
  );
};

export default HomePage;