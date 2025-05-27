import { useState } from "react";
import { Container } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaSearch,
  FaArrowRight,
  FaBook,
  FaStar,
  FaUserFriends,
} from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { colors, typography, shadows, borderRadius } from "../styles/theme";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// const shimmer = keyframes`
//   0% { background-position: -1000px 0; }
//   100% { background-position: 1000px 0; }
// `;

const PageContainer = styled.div`
  min-height: 100vh;
  margin-top: 80px;
  background: ${colors.background.primary};
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
`;

const HeroSection = styled.div`
  padding: 10rem 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)),
    url("/hero-books.jpg") center/cover no-repeat fixed;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);

  &:hover::before {
    animation-play-state: paused;
  }

  @media (max-width: 768px) {
    padding: 8rem 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  color: white;
  padding: 0 2rem;

  h1 {
    font-size: 3.2rem;
    font-weight: ${typography.fontWeights.bold};
    line-height: 1.1;
    margin-bottom: 2rem;
    font-family: "PT Serif", serif;
    font-style: italic;
    letter-spacing: -0.02em;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease forwards;
    background: linear-gradient(120deg, #ffffff 30%, #f0f0f0);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 3rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    line-height: ${typography.lineHeights.relaxed};
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease forwards 0.2s;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    font-weight: 300;

    @media (max-width: 768px) {
      font-size: 1.25rem;
      margin-bottom: 2rem;
    }
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
  animation: fadeInUp 0.8s ease forwards 0.4s;
  box-shadow: ${shadows.lg}, 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: ${borderRadius.full};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.xl}, 0 0 30px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.5rem 1.75rem;
  font-size: 1.2rem;
  border: none;
  border-radius: ${borderRadius.full};
  background: transparent;
  color: white;
  transition: all 0.3s ease;
  padding-right: 4.5rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 300;
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  border: none;
  color: white;
  padding: 1rem;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  svg {
    font-size: 1.3rem;
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: rotate(90deg) scale(1.1);
  }
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 5rem;
  margin-top: 5rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards 0.6s;

  @media (max-width: 768px) {
    gap: 3rem;
    flex-wrap: wrap;
    margin-top: 4rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: white;
  transition: all 0.3s ease;
  padding: 1.5rem;
  border-radius: ${borderRadius.xl};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  min-width: 160px;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  svg {
    width: 2rem;
    height: 2rem;
    color: ${colors.secondary};
    margin-bottom: 0.5rem;
    animation: ${float} 3s ease-in-out infinite;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .value {
    font-size: 1.76rem;
    font-weight: ${typography.fontWeights.bold};
    font-family: ${typography.fonts.heading};
    line-height: 1;
    background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .label {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: ${typography.fontWeights.medium};
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &:hover .value {
    transform: scale(1.1);
  }

  &:hover .label {
    color: white;
  }

  @media (max-width: 768px) {
    min-width: 140px;
    padding: 1rem;

    .value {
      font-size: 2.25rem;
    }

    .label {
      font-size: 1rem;
    }

    svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const FeaturedSection = styled.section`
  padding: 4rem 0;
  background: ${colors.background.primary};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${colors.secondary}40,
      transparent
    );
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${colors.secondary};
    border-radius: ${borderRadius.full};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100px;
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.secondary};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: ${borderRadius.lg};
  transition: all 0.3s ease;
  border: 1px solid ${colors.secondary}40;

  &:hover {
    color: ${colors.primary};
    background: ${colors.background.secondary};
    transform: translateX(4px);
    border-color: ${colors.primary};
  }

  svg {
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards 0.2s;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HomePage = () => {
  const { keyword = "" } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(keyword);

  const {
    data,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["featured-books"],
    queryFn: async () => {
      const { data } = await axios.get("/api/books?limit=4");
      return data.books;
    },
    staleTime: 1000 * 60 * 5,
  });

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
            <h1>Find your peace, one page at a time</h1>
            <p>
              Welcome to PageHaven, your sanctuary of stories. Discover a
              curated collection of books that will transport you to new worlds
              and bring tranquility to your reading journey.
            </p>
            <SearchBox>
              <SearchInput
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
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
          ) : isError ? (
            <Message variant="danger">
              {error?.message || "Error loading books"}
            </Message>
          ) : !data || data.length === 0 ? (
            <Message>No books found</Message>
          ) : (
            <BookGrid>
              {data.map((book) => (
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
