import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Pagination, Navbar, Container } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaBookmark, FaRegBookmark, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ReadBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authAxios } = useContext(AuthContext);
  const contentRef = useRef(null);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        
        // Fetch book details
        const { data: bookData } = await authAxios.get(`/api/books/${id}`);
        setBook(bookData);
        
        // Fetch reading progress
        try {
          const { data: progressData } = await authAxios.get(`/api/books/${id}/progress`);
          setCurrentChapter(progressData.currentChapter || 0);
          setIsBookmarked(progressData.isBookmarked || false);
        } catch (err) {
          // If no progress exists, use defaults
          console.log('No reading progress found');
        }
        
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

    fetchBook();
  }, [id, authAxios]);

  useEffect(() => {
    // Save reading progress when chapter changes
    if (book && currentChapter >= 0) {
      const saveProgress = async () => {
        try {
          await authAxios.post(`/api/books/${id}/progress`, {
            currentChapter,
            isBookmarked,
          });
        } catch (error) {
          console.error('Error saving progress', error);
        }
      };
      
      saveProgress();
    }
  }, [currentChapter, isBookmarked, book, id, authAxios]);

  const goToNextChapter = () => {
    if (book && currentChapter < book.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      contentRef.current.scrollTop = 0;
    }
  };

  const goToPrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      contentRef.current.scrollTop = 0;
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Bookmark removed' : 'Bookmark added');
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`reader-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <Navbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'} className="reader-navbar">
        <Container>
          <Button 
            variant="outline-primary" 
            onClick={() => navigate(`/book/${id}`)}
            className="me-2"
          >
            <FaHome /> Back to Book
          </Button>
          
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              onClick={decreaseFontSize}
              className="me-2"
            >
              A-
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={increaseFontSize}
              className="me-2"
            >
              A+
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={toggleTheme}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
          </div>
          
          <Button 
            variant="outline-warning" 
            onClick={toggleBookmark}
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </Button>
        </Container>
      </Navbar>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="reader-content" ref={contentRef}>
          <div className="chapter-container">
            <h2 className="chapter-title">
              {book.chapters[currentChapter]?.title || 'Chapter Not Found'}
            </h2>
            
            <div 
              className="chapter-content"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ 
                __html: book.chapters[currentChapter]?.content || 'No content available' 
              }}
            ></div>
          </div>
          
          <div className="chapter-navigation">
            <Button 
              variant="primary" 
              onClick={goToPrevChapter}
              disabled={currentChapter === 0}
              className="me-2"
            >
              <FaArrowLeft /> Previous Chapter
            </Button>
            
            <div className="flex-grow-1 text-center">
              <Pagination className="justify-content-center">
                {book.chapters.map((_, index) => (
                  <Pagination.Item 
                    key={index} 
                    active={index === currentChapter}
                    onClick={() => {
                      setCurrentChapter(index);
                      contentRef.current.scrollTop = 0;
                    }}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
            
            <Button 
              variant="primary" 
              onClick={goToNextChapter}
              disabled={currentChapter === book.chapters.length - 1}
            >
              Next Chapter <FaArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadBookPage;