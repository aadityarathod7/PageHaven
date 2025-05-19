import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components';
import { colors, typography, transitions, borderRadius } from '../styles/theme';
import { memo } from 'react';

const StyledPagination = styled(Pagination)`
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;

  .page-item {
    .page-link {
      border: none;
      background: ${colors.background.secondary};
      color: ${colors.text.secondary};
      font-weight: ${typography.fontWeights.medium};
      min-width: 40px;
      height: 40px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: ${borderRadius.lg};
      transition: ${transitions.default};

      &:hover {
        background: ${colors.background.accent};
        color: ${colors.text.primary};
      }

      &:focus {
        box-shadow: 0 0 0 3px ${colors.secondary}15;
      }
    }

    &.active .page-link {
      background: ${colors.secondary};
      color: white;

      &:hover {
        background: ${colors.primary};
      }
    }

    &.disabled .page-link {
      background: ${colors.background.secondary};
      color: ${colors.text.light};
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

const Paginate = ({ pages, page, keyword = '' }) => {
  return (
    pages > 1 && (
      <StyledPagination>
        {[...Array(pages).keys()].map((x) => {
          const pageNum = x + 1;
          const path = keyword
            ? `/search/${keyword}/page/${pageNum}`
            : `/page/${pageNum}`;

          return (
            <LinkContainer key={pageNum} to={path}>
              <Pagination.Item active={pageNum === page}>
                {pageNum}
              </Pagination.Item>
            </LinkContainer>
          );
        })}
      </StyledPagination>
    )
  );
};

export default memo(Paginate);