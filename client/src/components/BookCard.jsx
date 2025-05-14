import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaDownload, FaBookmark, FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import { colors, typography, shadows, transitions, borderRadius } from '../styles/theme';

const StyledCard = styled(Card)`
  ${props => props.theme.commonStyles?.cardStyle || `
    background: ${colors.background.primary};
    border-radius: ${borderRadius.xl};
    box-shadow: ${shadows.md};
    transition: all 0.3s ease-in-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  `}
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-5px) rotateX(2deg);
    box-shadow: ${shadows.lg};

    .card-img-wrapper:before {
      opacity: 1;
      transform: perspective(1000px) rotateX(0deg) translateY(0);
    }

    .card-img-top {
      transform: scale(1.05) translateY(-5px);
    }

    &:before {
      opacity: 1;
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${borderRadius.xl};
    border: 2px solid transparent;
    background: linear-gradient(45deg, ${colors.secondary}, #3cd88f, ${colors.secondary});
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: all 0.3s ease;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${borderRadius.xl} ${borderRadius.xl} 0 0;
  height: 320px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(60, 216, 143, 0.4) 0%,
      rgba(60, 216, 143, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    z-index: 1;
    opacity: 0;
    transform: perspective(1000px) rotateX(10deg) translateY(-10px);
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    backdrop-filter: blur(2px);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.5) 30%,
      transparent 100%
    );
    z-index: 1;
  }
`;

const CoverImage = styled(Card.Img)`
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center;
  filter: brightness(0.95) contrast(1.1);
`;

const BookBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.5rem 1rem;
  border-radius: ${borderRadius.lg};
  color: white;
  font-weight: ${typography.fontWeights.bold};
  font-size: 0.9rem;
  z-index: 2;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
  opacity: 0;
  transition: all 0.3s ease;

  ${StyledCard}:hover & {
    transform: translateY(0);
    opacity: 1;
  }
`;

const CardBody = styled(Card.Body)`
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
`;

const BookTitle = styled(Link)`
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  font-size: 1.35rem;
  color: ${colors.text.primary};
  text-decoration: none;
  margin-bottom: 0.5rem;
  display: block;
  transition: ${transitions.default};
  line-height: 1.3;

  &:hover {
    color: ${colors.secondary};
    text-shadow: 0 0 20px rgba(60, 216, 143, 0.3);
  }
`;

const AuthorName = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  margin-bottom: 1rem;
  font-weight: ${typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 3px;
    background: ${colors.secondary};
    border-radius: 50%;
  }
`;

const CategoryBadge = styled(Badge)`
  background: linear-gradient(135deg, #3cd88f 0%, #2fb344 100%) !important;
  color: white;
  font-weight: ${typography.fontWeights.medium};
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: ${borderRadius.full};
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: none;
  box-shadow: 0 2px 4px rgba(60, 216, 143, 0.2);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(60, 216, 143, 0.3);
  }
`;

const Description = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.95rem;
  line-height: ${typography.lineHeights.relaxed};
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
  position: relative;
  padding-left: 1rem;
  border-left: 2px solid rgba(60, 216, 143, 0.3);
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.medium};
  padding: 0.5rem 0.75rem;
  border-radius: ${borderRadius.lg};
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);

  svg {
    color: ${colors.secondary};
    transition: all 0.2s ease;
  }

  &:hover {
    background: rgba(60, 216, 143, 0.1);
    svg {
      transform: scale(1.1);
    }
  }
`;

const BookmarkButton = styled.button`
  background: rgba(60, 216, 143, 0.1);
  border: none;
  width: 42px;
  height: 42px;
  border-radius: ${borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${colors.secondary}, #3cd88f);
    opacity: 0;
    transition: all 0.3s ease;
  }

  svg {
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(60, 216, 143, 0.3);

    &:before {
      opacity: 1;
    }

    svg {
      color: white;
      transform: scale(1.1);
    }
  }
`;

const Rating = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.75);
  padding: 0.5rem 0.75rem;
  border-radius: ${borderRadius.lg};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
  font-weight: ${typography.fontWeights.bold};
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const BookCard = ({ book }) => {
  return (
    <StyledCard>
      <Link to={`/book/${book._id}`}>
        <ImageWrapper className="card-img-wrapper">
          <CoverImage variant="top" src={book.coverImage} alt={book.title} className="card-img-top" />
          <BookBadge>
            New Release
          </BookBadge>
          <Rating>
            <FaStar /> 4.5
          </Rating>
        </ImageWrapper>
      </Link>
      <CardBody>
        <BookTitle to={`/book/${book._id}`}>{book.title}</BookTitle>
        <AuthorName>by {book.author.name}</AuthorName>
        
        {book.categories && book.categories.length > 0 && (
          <div className="mb-3">
            {book.categories.map((category, index) => (
              <CategoryBadge key={index}>
                {category}
              </CategoryBadge>
            ))}
          </div>
        )}
        
        <Description>{book.description}</Description>
        
        <StatsContainer>
          <div className="d-flex gap-2">
            <StatItem>
              <FaEye /> {book.readCount}
            </StatItem>
            <StatItem>
              <FaDownload /> {book.downloads}
            </StatItem>
          </div>
          <BookmarkButton>
            <FaBookmark />
          </BookmarkButton>
        </StatsContainer>
      </CardBody>
    </StyledCard>
  );
};

export default BookCard;