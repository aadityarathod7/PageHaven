import React, { useState, useContext, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaDownload,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaBookOpen,
  FaImage,
  FaChevronRight,
} from "react-icons/fa";
import styled from "styled-components";
import {
  colors,
  typography,
  shadows,
  transitions,
  commonStyles,
} from "../styles/theme";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { API_URL } from "../config/config";
import { getImageUrl, handleImageError } from "../utils/imageUtils";
import { memo } from "react";

const StyledCard = styled(Card)`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: none;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 300px;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0%,
      transparent 100%
    );
    z-index: 1;
  }
`;

const CoverImage = styled(Card.Img)`
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;

  ${StyledCard}:hover & {
    transform: scale(1.08);
  }
`;

const ImagePlaceholder = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${colors.background.secondary},
    ${colors.background.accent}
  );
  color: ${colors.text.light};

  svg {
    font-size: 3.5rem;
    opacity: 0.6;
  }
`;

const BookBadge = styled.div`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.3rem 1rem;
  border-radius: 8px;
  color: ${colors.primary};
  font-weight: 600;
  font-size: 1rem;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
`;

const PurchaseBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, ${colors.success}, #2dd4bf);
  color: white;
  padding: 0.3rem 1rem;
  font-weight: bold;
  z-index: 100;
  margin: 1.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${shadows.lg};
  pointer-events: none;
  backdrop-filter: blur(5px);
`;

const CardBody = styled(Card.Body)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-top: 1px solid rgba(241, 241, 241, 0.5);
  background: rgba(255, 255, 255, 0.95);
`;

const BookTitle = styled(Link)`
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
  margin-bottom: 0.75rem;
  display: block;
  transition: color 0.3s ease;
  line-height: 1.4;
  letter-spacing: -0.02em;

  &:hover {
    color: ${colors.primary};
  }
`;

const AuthorName = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  margin-bottom: 1.25rem;
  font-weight: ${typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: "by";
    color: ${colors.text.light};
    font-size: 0.9rem;
    font-style: italic;
  }

  span {
    color: ${colors.text.primary};
    transition: ${transitions.default};
    font-weight: 600;

    &:hover {
      color: ${colors.primary};
    }
  }
`;

const CategoryBadge = styled(Badge)`
  background: linear-gradient(135deg, ${colors.success}, #2dd4bf);
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-right: 0.6rem;
  margin-bottom: 0.6rem;
  border: 1px solid rgba(124, 58, 237, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.primary}15 !important;
    transform: translateY(-2px);
  }
`;

const Description = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.$expanded ? "unset" : "2")};
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  padding-left: 1rem;
  border-left: 3px solid ${colors.primary}30;
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    color: white;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0 -1rem -1rem;
  background: ${colors.background.light};
  border-top: 1px solid rgba(178, 153, 237, 0.8);
  min-height: 60px;
`;

const StatsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 70px;

  svg {
    color: ${colors.primary};
    font-size: 1.1rem;
    flex-shrink: 0;
  }
`;

const FavoriteButton = styled.button`
  background: ${(props) => (props.$isFavorite ? "#fef2f2" : "white")};
  border: 1px solid ${(props) => (props.$isFavorite ? "#fecaca" : "#e5e7eb")};
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$isFavorite ? "#dc2626" : "#9ca3af")};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${(props) => (props.$isFavorite ? "#fee2e2" : "#f9fafb")};
    border-color: ${(props) => (props.$isFavorite ? "#fca5a5" : "#d1d5db")};
    color: ${(props) => (props.$isFavorite ? "#ef4444" : colors.primary)};
    transform: scale(1.05);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Rating = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #eab308;
  font-weight: ${typography.fontWeights.bold};
  backdrop-filter: blur(8px);
  z-index: 1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const CardContainer = styled.div`
  ${commonStyles.cardStyle}
`;

const BookCard = ({ book, onFavoriteChange }) => {
  const { authAxios, userInfo } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkBookStatus = async () => {
      if (!userInfo || !book._id) {
        return;
      }

      try {
        // Check purchase status
        const { data: purchaseData } = await authAxios.get(
          `/api/orders/check-purchase/${book._id}`
        );
        setIsPurchased(purchaseData.isPurchased);

        // Check favorite status
        const { data: progressData } = await authAxios.get(
          `/api/books/${book._id}/progress`
        );
        setIsFavorite(progressData.isFavorite || false);
      } catch (error) {
        console.error("Error checking book status:", error);
      }
    };

    checkBookStatus();
  }, [book._id, authAxios, userInfo]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      await authAxios.post(`/api/books/${book._id}/progress`, {
        isFavorite: !isFavorite,
      });
      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites"
      );

      // Notify parent component about the favorite status change
      if (onFavoriteChange) {
        onFavoriteChange(book._id, !isFavorite);
      }
    } catch (error) {
      toast.error("Error updating favorite status");
      console.error("Error updating favorite status:", error);
    }
  };

  const handleReadMore = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  const coverImageUrl = getImageUrl(book.coverImage);

  return (
    <StyledCard>
      <Link to={`/book/${book._id}`} style={{ textDecoration: "none" }}>
        <ImageWrapper className="card-img-wrapper">
          <CoverImage
            variant="top"
            src={coverImageUrl}
            alt={book.title}
            className="card-img-top"
            onError={handleImageError}
            loading="lazy"
          />
          <BookBadge>₹{book.price}</BookBadge>
          {isPurchased && userInfo && (
            <PurchaseBadge>
              <FaBookOpen /> Purchased
            </PurchaseBadge>
          )}
          <Rating>
            <FaStar /> 4.5
          </Rating>
        </ImageWrapper>
      </Link>
      <CardBody>
        <BookTitle to={`/book/${book._id}`}>{book.title}</BookTitle>
        <AuthorName>
          <span>{book.author?.name || "Unknown Author"}</span>
        </AuthorName>

        {book.categories && book.categories.length > 0 && (
          <div className="mb-3">
            {book.categories.map((category, index) => (
              <CategoryBadge key={index}>{category}</CategoryBadge>
            ))}
          </div>
        )}

        <Description $expanded={isExpanded}>{book.description}</Description>
        {book.description && book.description.length > 100 && (
          <ReadMoreButton onClick={handleReadMore}>
            {isExpanded ? "Show Less" : "Read More"}
            <FaChevronRight
              style={{
                transform: isExpanded ? "rotate(90deg)" : "none",
                transition: "transform 0.2s ease",
              }}
            />
          </ReadMoreButton>
        )}

        <StatsContainer>
          <StatsGroup>
            <StatItem>
              <FaEye /> {book.readCount || 0}
            </StatItem>
            <StatItem>
              <FaDownload /> {book.downloads || 0}
            </StatItem>
          </StatsGroup>
          <FavoriteButton
            onClick={handleFavoriteClick}
            $isFavorite={isFavorite}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </FavoriteButton>
        </StatsContainer>
      </CardBody>
    </StyledCard>
  );
};

export default memo(BookCard);
