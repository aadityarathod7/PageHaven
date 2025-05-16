import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaDownload, FaBook, FaEye, FaEdit, FaTrash, FaBookOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/config';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { colors, typography, shadows, transitions, borderRadius } from '../styles/theme';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.text.secondary};
  text-decoration: none;
  font-weight: ${typography.fontWeights.medium};
  margin-bottom: 2rem;
  transition: ${transitions.default};

  &:hover {
    color: ${colors.primary};
    transform: translateX(-4px);
  }
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  transition: ${transitions.default};

  &:hover {
    transform: scale(1.02);
    box-shadow: ${shadows.xl};
  }
`;

const BookDetails = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  padding: 2rem;
  box-shadow: ${shadows.md};
`;

const BookTitle = styled.h1`
  font-family: ${typography.fonts.heading};
  color: ${colors.text.primary};
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: ${typography.fontWeights.bold};
`;

const AuthorName = styled.h2`
  color: ${colors.text.secondary};
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: ${typography.fontWeights.medium};
`;

const Categories = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const Category = styled.span`
  background: ${colors.background.accent};
  color: ${colors.text.primary};
  padding: 0.5rem 1rem;
  border-radius: ${borderRadius.full};
  font-size: 0.875rem;
  font-weight: ${typography.fontWeights.medium};
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  color: ${colors.text.secondary};
  font-size: 1rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Description = styled.p`
  color: ${colors.text.primary};
  line-height: ${typography.lineHeights.relaxed};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const Price = styled.div`
  font-size: 1.5rem;
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeights.bold};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: ${colors.secondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${borderRadius.lg};
  font-weight: ${typography.fontWeights.semibold};
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: ${transitions.default};
  color: white;
  background: ${props => 
    props.$variant === 'danger' ? colors.accent :
    props.$variant === 'success' ? colors.secondary :
    colors.primary};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
    opacity: 0.9;
  }

  &:disabled {
    background: ${colors.text.light};
    cursor: not-allowed;
    transform: none;
  }
`;

const AdminActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const TableOfContents = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  padding: 2rem;
  box-shadow: ${shadows.md};
  margin-top: 3rem;

  h3 {
    font-family: ${typography.fonts.heading};
    color: ${colors.text.primary};
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: ${typography.fontWeights.bold};
  }
`;

const ChapterList = styled.ol`
  list-style-position: inside;
  padding: 0;

  li {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid ${colors.background.accent};
    color: ${colors.text.primary};
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:last-child {
      border-bottom: none;
    }

    svg {
      color: ${colors.secondary};
    }
  }
`;

const BookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo, authAxios } = useContext(AuthContext);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await authAxios.get(`/api/books/${id}`);
        console.log('Fetched book data:', data); // Debug log
        setBook(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book:', error); // Debug log
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, authAxios]);

  const downloadPDFHandler = async () => {
    if (!userInfo) {
      toast.error('Please login to download books');
      navigate('/login');
      return;
    }

    try {
      setDownloadingPdf(true);
      const response = await authAxios.get(`/api/books/${id}/download/pdf`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${book.title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      link.remove();
      
      toast.success('Book downloaded successfully');
      setDownloadingPdf(false);
    } catch (error) {
      toast.error('Download failed');
      setDownloadingPdf(false);
    }
  };

  const readBookHandler = () => {
    navigate(`/read/${id}`);
  };

  const deleteBookHandler = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await authAxios.delete(`/api/books/${id}`);
        toast.success('Book deleted');
        navigate('/admin/books');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting book');
      }
    }
  };

  const handlePurchase = () => {
    console.log('Purchase initiated for book:', id); // Debug log

    if (!userInfo) {
      toast.error('Please login to purchase books');
      navigate('/login');
      return;
    }

    // Debug log for book data
    console.log('Book data:', {
      price: book.price,
      title: book.title
    });

    if (!book.price) {
      toast.error('Book price is not set');
      return;
    }

    try {
      navigate('/checkout', { 
        state: { 
          bookId: id,
          amount: book.price * 100, // Convert to paise for Razorpay (1 INR = 100 paise)
          bookTitle: book.title
        } 
      });
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to proceed to checkout');
    }
  };

  return (
    <PageContainer>
      <BackButton to="/">
        <FaArrowLeft /> Back to Books
      </BackButton>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <BookGrid>
            <div>
              <CoverImage 
                src={book.coverImage ? 
                  (book.coverImage.startsWith('http') ? book.coverImage : `${API_URL}${book.coverImage}`) 
                  : `${API_URL}/uploads/default-cover.jpg`} 
                alt={book.title} 
              />
            </div>
            
            <BookDetails>
              <BookTitle>{book.title}</BookTitle>
              <AuthorName>By {book.author.name}</AuthorName>
              
              {book.categories && book.categories.length > 0 && (
                <Categories>
                  {book.categories.map((category, index) => (
                    <Category key={index}>{category}</Category>
                  ))}
                </Categories>
              )}
              
              <Stats>
                <div>
                  <FaEye /> {book.readCount} reads
                </div>
                <div>
                  <FaDownload /> {book.downloads} downloads
                </div>
              </Stats>
              
              <Description>{book.description}</Description>

              <Price>
                Price: <span>₹{book.price ? book.price.toFixed(2) : '0.00'}</span>
              </Price>
              
              <ButtonGroup>
                {book.isPurchased ? (
                  <>
                    <Button onClick={readBookHandler}>
                      <FaBook /> Read Book
                    </Button>
                    
                    <Button 
                      $variant="success"
                      onClick={downloadPDFHandler} 
                      disabled={downloadingPdf}
                    >
                      <FaDownload />
                      {downloadingPdf ? 'Downloading...' : 'Download PDF'}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handlePurchase}
                    $variant="success"
                    disabled={!book.price}
                  >
                    ₹{book.price ? book.price.toFixed(2) : '0.00'} - Buy Now
                  </Button>
                )}
                
                {userInfo && userInfo.role === 'admin' && (
                  <AdminActions>
                    <Button as={Link} to={`/admin/book/${book._id}/edit`}>
                      <FaEdit /> Edit
                    </Button>
                    <Button 
                      onClick={deleteBookHandler}
                      $variant="danger"
                    >
                      <FaTrash /> Delete Book
                    </Button>
                  </AdminActions>
                )}
              </ButtonGroup>
            </BookDetails>
          </BookGrid>
          
          {book.isPurchased && book.chapters && book.chapters.length > 0 && (
            <TableOfContents>
              <h3>Table of Contents</h3>
              <ChapterList>
                {book.chapters.map((chapter, index) => (
                  <li key={index}>
                    <FaBookOpen />
                    {chapter.title}
                  </li>
                ))}
              </ChapterList>
            </TableOfContents>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default BookPage;