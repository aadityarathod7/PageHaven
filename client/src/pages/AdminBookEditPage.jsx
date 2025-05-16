import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Tab, Nav, Image } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import { FaSave, FaBook, FaUpload, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import styled from 'styled-components';
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const AdminBookEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authAxios } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [price, setPrice] = useState(0);
  const [coverImage, setCoverImage] = useState('/uploads/default-cover.jpg');
  const [chapters, setChapters] = useState([{ title: 'Chapter 1', content: '', order: 0 }]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await authAxios.get(`/api/books/${id}`);

        if (!data) {
          throw new Error('No data received from server');
        }

        setTitle(data.title || '');
        setDescription(data.description || '');
        setAuthor(data.author?.name || '');
        setCategories(Array.isArray(data.categories) ? data.categories.join(', ') : '');
        setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setStatus(data.status || 'draft');
        setPrice(data.price || 0);
        setCoverImage(data.coverImage || '/uploads/default-cover.jpg');
        setChapters(
          data.chapters && data.chapters.length > 0
            ? data.chapters
            : [{ title: 'Chapter 1', content: '', order: 0 }]
        );
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Error loading book'
        );
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, authAxios]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUploading(true);
      
      const { data } = await authAxios.post(`/api/books/${id}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setCoverImage(data.coverImage);
      setUploading(false);
      toast.success('Cover image uploaded successfully');
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error uploading image'
      );
      setUploading(false);
    }
  };

  const addChapterHandler = () => {
    const newOrder = chapters.length;
    setChapters([
      ...chapters,
      { title: `Chapter ${newOrder + 1}`, content: '', order: newOrder },
    ]);
  };

  const removeChapterHandler = (index) => {
    if (chapters.length > 1) {
      const updatedChapters = [...chapters];
      updatedChapters.splice(index, 1);
      
      // Update order for remaining chapters
      const reorderedChapters = updatedChapters.map((chapter, idx) => ({
        ...chapter,
        order: idx,
      }));
      
      setChapters(reorderedChapters);
    } else {
      toast.warning('Cannot remove the only chapter');
    }
  };

  const updateChapterTitle = (index, title) => {
    const updatedChapters = [...chapters];
    updatedChapters[index].title = title;
    setChapters(updatedChapters);
  };

  const updateChapterContent = (index, content) => {
    const updatedChapters = [...chapters];
    updatedChapters[index].content = content;
    setChapters(updatedChapters);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      const bookData = {
        title,
        description,
        authorName: author,
        categories: categories.split(',').map(cat => cat.trim()).filter(cat => cat),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status,
        price: Number(price),
        chapters: chapters.map(chapter => ({
          title: chapter.title,
          content: chapter.content,
          order: chapter.order,
        })),
      };

      await authAxios.put(`/api/books/${id}`, bookData);
      setSaving(false);
      toast.success('Book updated successfully');
      navigate('/admin/books');
    } catch (error) {
      setSaving(false);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error updating book'
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/admin/books')}>
          <FaArrowLeft /> Back to Books
        </BackButton>
        <h1>Edit Book</h1>
      </PageHeader>

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
            <label htmlFor="author">Author Name</label>
            <input
              type="text"
              id="author"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              placeholder="Enter book price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
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
            <label>Chapters</label>
            {chapters.map((chapter, index) => (
              <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) => updateChapterTitle(index, e.target.value)}
                  placeholder="Chapter title"
                  style={{ marginBottom: '1rem' }}
                />
                <textarea
                  value={chapter.content}
                  onChange={(e) => updateChapterContent(index, e.target.value)}
                  placeholder="Chapter content"
                  rows="4"
                />
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChapterHandler(index)}
                    style={{ marginTop: '0.5rem', color: 'red', background: 'none', border: 'none' }}
                  >
                    <FaTrash /> Remove Chapter
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addChapterHandler}
              style={{ background: 'none', border: 'none', color: colors.primary }}
            >
              <FaPlus /> Add Chapter
            </button>
          </FormGroup>

          <FormGroup>
            <label htmlFor="image">Cover Image</label>
            <input
              type="file"
              id="image"
              onChange={uploadFileHandler}
              accept="image/*"
            />
            {coverImage && (
              <ImagePreview>
                <img src={coverImage} alt="Cover preview" />
              </ImagePreview>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" disabled={saving}>
              <FaSave /> Save Changes
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

export default AdminBookEditPage;