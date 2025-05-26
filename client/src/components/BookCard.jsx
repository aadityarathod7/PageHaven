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
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: none;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 280px;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.7) 0%,
      transparent 100%
    );
    z-index: 1;
  }
`;

const CoverImage = styled(Card.Img)`
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${StyledCard}:hover & {
    transform: scale(1.05);
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
    font-size: 3rem;
    opacity: 0.5;
  }
`;

const BookBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.75);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  z-index: 2;
`;

const PurchaseBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: ${colors.success};
  color: white;
  padding: 0.5rem 1rem;
  font-weight: bold;
  z-index: 100;
  margin: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${shadows.md};
  pointer-events: none;
`;

const CardBody = styled(Card.Body)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-top: 1px solid #f1f1f1;
`;

const BookTitle = styled(Link)`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  text-decoration: none;
  margin-bottom: 0.5rem;
  display: block;
  transition: color 0.2s ease;
  line-height: 1.4;

  &:hover {
    color: #7c3aed;
  }
`;

const AuthorName = styled.p`
  font-size: 0.95rem;
  color: ${colors.text.secondary};
  margin-bottom: 1rem;
  font-weight: ${typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: "by";
    color: ${colors.text.light};
    font-size: 0.85rem;
    font-style: italic;
  }

  span {
    color: ${colors.text.primary};
    transition: ${transitions.default};

    &:hover {
      color: ${colors.secondary};
    }
  }
`;

const CategoryBadge = styled(Badge)`
  background: #f3f4f6 !important;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.75rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: none;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb !important;
    transform: translateY(-1px);
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
  border-left: 2px solid ${colors.primary}40;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  margin: 1rem -1.5rem -1.5rem;
  background: #fafafa;
  border-top: 1px solid #f1f1f1;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;

  svg {
    color: #7c3aed;
    font-size: 1rem;
  }
`;

const FavoriteButton = styled.button`
  background: transparent;
  border: 1px solid #e5e7eb;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$isFavorite ? "#dc2626" : "#9ca3af")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$isFavorite ? "#fef2f2" : "#f9fafb")};
    border-color: ${(props) => (props.$isFavorite ? "#ef4444" : "#d1d5db")};
    color: ${(props) => (props.$isFavorite ? "#ef4444" : "#7C3AED")};
  }

  svg {
    font-size: 1.1rem;
  }
`;

const Rating = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.75);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
  font-weight: ${typography.fontWeights.bold};
  backdrop-filter: blur(4px);
  z-index: 1;
  pointer-events: none;
`;

const CardContainer = styled.div`
  ${commonStyles.cardStyle}
`;

const BookCard = ({ book, onFavoriteChange }) => {
  const { authAxios, userInfo } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

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

        <Description>{book.description}</Description>

        <StatsContainer>
          <div className="d-flex gap-2">
            <StatItem>
              <FaEye /> {book.readCount || 0}
            </StatItem>
            <StatItem>
              <FaDownload /> {book.downloads || 0}
            </StatItem>
          </div>
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
