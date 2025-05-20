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

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  margin-top: 80px;
  background: ${colors.background.primary};
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
`;

const HeroSection = styled.div`
  padding: 8rem 0;
  background: linear-gradient(
      135deg,
      ${colors.primary}dd,
      ${colors.secondary}dd
    ),
    url("/hero-books.jpg") center/cover no-repeat;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23FFFFFF' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.6;
    animation: ${shimmer} 60s linear infinite;
  }

  &:hover::before {
    animation-play-state: paused;
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
    background: linear-gradient(to right, #ffffff, #f0f0f0);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

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
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
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
  transition: all 0.3s ease;
  padding-right: 4rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
    transform: scale(1.01);
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
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    background: ${colors.primary};
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  svg {
    font-size: 1.2rem;
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: rotate(90deg);
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
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: ${borderRadius.xl};

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 2rem;
    height: 2rem;
    color: ${colors.secondary};
    margin-bottom: 0.5rem;
    animation: ${float} 3s ease-in-out infinite;
  }

  .value {
    font-size: 2.5rem;
    font-weight: ${typography.fontWeights.bold};
    font-family: ${typography.fonts.heading};
    line-height: 1;
    background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease;
  }

  .label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: ${typography.fontWeights.medium};
    transition: all 0.3s ease;
  }

  &:hover .value {
    transform: scale(1.1);
  }

  &:hover .label {
    color: white;
  }

  @media (max-width: 768px) {
    .value {
      font-size: 2rem;
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
