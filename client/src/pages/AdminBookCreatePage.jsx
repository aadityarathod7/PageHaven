import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaUpload, FaBook } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { colors, typography, shadows, transitions, borderRadius } from '../styles/theme';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  h1 {
    font-family: ${typography.fonts.heading};
    color: ${colors.text.primary};
    font-size: 2rem;
    font-weight: ${typography.fontWeights.bold};
    margin: 0;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.text.secondary};
  background: none;
  border: none;
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: ${transitions.default};

  &:hover {
    color: ${colors.primary};
    transform: translateX(-4px);
  }
`;

const FormContainer = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    color: ${colors.text.primary};
    font-weight: ${typography.fontWeights.medium};
    margin-bottom: 0.5rem;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid ${colors.background.accent};
    border-radius: ${borderRadius.lg};
    background: ${colors.background.secondary};
    color: ${colors.text.primary};
    font-family: ${typography.fonts.body};
    font-size: 0.95rem;
    transition: ${transitions.default};

    &:hover {
      border-color: ${colors.text.light};
    }

    &:focus {
      outline: none;
      border-color: ${colors.secondary};
      background: ${colors.background.primary};
      box-shadow: 0 0 0 3px ${colors.secondary}15;
    }

    &::placeholder {
      color: ${colors.text.light};
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  
  img {
    max-width: 200px;
    border-radius: ${borderRadius.lg};
    box-shadow: ${shadows.md};
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: ${props => props.variant === 'secondary' ? colors.background.accent : colors.secondary};
  color: ${props => props.variant === 'secondary' ? colors.text.primary : 'white'};
  border: none;
  border-radius: ${borderRadius.lg};
  font-weight: ${typography.fontWeights.semibold};
  cursor: pointer;
  transition: ${transitions.default};
  box-shadow: ${shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    background: ${props => props.variant === 'secondary' ? colors.background.accent : colors.primary};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const AdminBookCreatePage = () => {
  const navigate = useNavigate();
  const { authAxios } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setCoverImage(previewUrl);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // First create the book without cover image
      const bookData = {
        title,
        authorName,
        description,
        categories: categories.split(',').map(cat => cat.trim()).filter(cat => cat),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status
      };

      // Create the book
      const { data: newBook } = await authAxios.post('/api/books', bookData);

      // If we have a selected file, upload it
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        await authAxios.post(`/api/books/${newBook._id}/cover`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setLoading(false);
      toast.success('Book created successfully');
      navigate(`/admin/book/${newBook._id}/edit`);
    } catch (error) {
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      setError(errorMessage);
      setLoading(false);
      toast.error(errorMessage);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/admin/books')}>
          <FaArrowLeft /> Back to Books
        </BackButton>
        <h1>Create New Book</h1>
      </PageHeader>

      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}

      <FormContainer>
        <form onSubmit={submitHandler}>
          <FormGroup>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="authorName">Author Name</label>
            <input
              type="text"
              id="authorName"
              placeholder="Enter author name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter book description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="categories">Categories</label>
            <input
              type="text"
              id="categories"
              placeholder="Enter categories (comma-separated)"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              placeholder="Enter tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label htmlFor="image">Cover Image</label>
            <input
              type="file"
              id="image"
              onChange={handleImageSelect}
              accept="image/*"
            />
            {coverImage && (
              <ImagePreview>
                <img src={coverImage} alt="Cover preview" />
              </ImagePreview>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" disabled={loading}>
              <FaBook /> Create Book
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/books')}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default AdminBookCreatePage;