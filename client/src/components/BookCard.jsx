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
  borderRadius,
} from "../styles/theme";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { API_URL } from "../config/config";
import { getImageUrl, handleImageError } from "../utils/imageUtils";
import { memo } from "react";

const StyledCard = styled(Card)`
  ${(props) =>
    props.theme.commonStyles?.cardStyle ||
    `
    background: rgba(255, 255, 255, 0.05);
    border-radius: ${borderRadius.xl};
    box-shadow: ${shadows.md};
    transition: all 0.3s ease-in-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  `}
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.lg};
    background: rgba(255, 255, 255, 0.08);

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
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${borderRadius.xl};
    border: 2px solid transparent;
    background: linear-gradient(
      45deg,
      ${colors.secondary}50,
      #3cd88f50,
      ${colors.secondary}50
    );
    -webkit-mask: linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
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
  height: 250px;

  &:before {
    content: "";
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
    content: "";
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
  pointer-events: none;
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
  border-radius: ${borderRadius.lg};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${shadows.md};
  pointer-events: none;
`;

const CardBody = styled(Card.Body)`
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.02) 50%,
    transparent 100%
  );
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
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
  margin-top: auto;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0 0 ${borderRadius.xl} ${borderRadius.xl};
  padding: 1rem 1.75rem;
  margin: 1.75rem -1.75rem -1.75rem -1.75rem;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
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
  background: rgba(255, 255, 255, 0.03);

  svg {
    color: ${colors.secondary};
    transition: all 0.2s ease;
  }

  &:hover {
    background: rgba(60, 216, 143, 0.08);
    transform: translateY(-1px);
    svg {
      transform: scale(1.1);
      color: ${colors.primary};
    }
  }
`;

const FavoriteButton = styled.button`
  background: rgba(255, 99, 132, 0.1);
  border: none;
  width: 42px;
  height: 42px;
  border-radius: ${borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$isFavorite ? "#ff6384" : colors.text.secondary)};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ff6384, #ff8c94);
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
    box-shadow: 0 4px 12px rgba(255, 99, 132, 0.3);

    &:before {
      opacity: ${(props) => (props.$isFavorite ? 1 : 0)};
    }

    svg {
      color: ${(props) =>
        props.$isFavorite ? "white" : colors.text.secondary};
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
  pointer-events: none;
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
