import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaDownload, FaBookmark } from 'react-icons/fa';
import styled from 'styled-components';
import { colors, typography, shadows, transitions, borderRadius } from '../styles/theme';

const StyledCard = styled(Card)`
  ${props => props.theme.commonStyles?.cardStyle || `
    background: ${colors.background.primary};
    border-radius: ${borderRadius.xl};
    box-shadow: ${shadows.md};
    transition: ${transitions.default};
    border: 1px solid ${colors.background.accent};
  `}
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .card-img-top {
    height: 320px;
    object-fit: cover;
    transition: ${transitions.default};
  }

  &:hover {
    .card-img-top {
      transform: scale(1.03);
    }
  }
`;

const CardBody = styled(Card.Body)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const BookTitle = styled(Link)`
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  font-size: 1.25rem;
  color: ${colors.text.primary};
  text-decoration: none;
  margin-bottom: 0.5rem;
  display: block;
  transition: ${transitions.default};

  &:hover {
    color: ${colors.secondary};
  }
`;

const AuthorName = styled.p`
  font-size: 0.95rem;
  color: ${colors.text.secondary};
  margin-bottom: 1rem;
  font-weight: ${typography.fontWeights.medium};
`;

const CategoryBadge = styled(Badge)`
  background: #3cd88f !important;
  color: ${colors.text.secondary};
  font-weight: ${typography.fontWeights.medium};
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${borderRadius.full};
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${colors.background.accent};
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
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${colors.background.accent};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.medium};

  svg {
    color: ${colors.secondary};
  }
`;

const BookmarkButton = styled.button`
  background: ${colors.background.secondary};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: ${borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.secondary};
  cursor: pointer;
  transition: ${transitions.default};

  &:hover {
    background: ${colors.secondary};
    color: white;
    transform: translateY(-2px);
  }
`;

const BookCard = ({ book }) => {
  return (
    <StyledCard>
      <Link to={`/book/${book._id}`}>
        <Card.Img variant="top" src={book.coverImage} alt={book.title} />
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
          <div className="d-flex gap-3">
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