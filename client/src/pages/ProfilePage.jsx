import { useState, useEffect, useContext } from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaBookmark,
  FaUser,
  FaBook,
  FaClock,
  FaEdit,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import Message from "../components/Message";
import styled from "styled-components";
import {
  colors,
  typography,
  shadows,
  transitions,
  borderRadius,
  commonStyles,
  gradients,
} from "../styles/theme";

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 80px auto 0;
  min-height: calc(100vh - 140px);
`;

const PageTitle = styled.h1`
  background: ${gradients.text};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: ${typography.fonts.heading};
  font-size: 1.75rem;
  font-weight: ${typography.fontWeights.bold};
  margin: 0 0 2rem;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: ${colors.secondary};
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 80px;
  }
`;

const ProfileCard = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  border: 1px solid ${colors.background.accent};
  transition: ${transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.xl};
    border-color: ${colors.secondary}40;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${gradients.primary};
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  padding: 1rem;
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.lg};

  .profile-icon {
    width: 70px;
    height: 70px;
    background: ${gradients.primary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    color: white;
    box-shadow: ${shadows.md};
    transition: ${transitions.default};

    svg {
      font-size: 1.75rem;
    }

    &:hover {
      transform: scale(1.05) rotate(5deg);
      box-shadow: ${shadows.lg};
    }
  }

  h2 {
    margin: 0;
    font-family: ${typography.fonts.heading};
    background: ${gradients.text};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: ${typography.fontWeights.bold};
    font-size: 1.5rem;
  }

  p {
    margin: 0.5rem 0 0;
    color: ${colors.text.secondary};
    font-size: 0.95rem;
  }
`;

const StyledForm = styled(Form)`
  .form-label {
    font-weight: ${typography.fontWeights.medium};
    color: ${colors.text.primary};
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .form-control {
    border-radius: ${borderRadius.lg};
    border: 2px solid ${colors.background.accent};
    padding: 0.75rem 1rem;
    transition: ${transitions.default};
    font-size: 0.95rem;
    background: ${colors.background.secondary};
    font-family: ${typography.fonts.body};
    color: ${colors.text.primary};

    &:hover {
      border-color: ${colors.secondary}40;
    }

    &:focus {
      border-color: ${colors.secondary};
      box-shadow: 0 0 0 4px ${colors.secondary}15;
      background: ${colors.background.primary};
    }

    &::placeholder {
      color: ${colors.text.light};
    }
  }

  .form-text {
    color: ${colors.text.secondary};
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  .mb-3 {
    margin-bottom: 1.5rem !important;
  }

  .mb-4 {
    margin-bottom: 2rem !important;
  }
`;

const Button = styled.button`
  background: ${gradients.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${borderRadius.lg};
  font-weight: ${typography.fontWeights.semibold};
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: ${shadows.md};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    background: ${gradients.hover};
  }

  &:focus {
    box-shadow: 0 0 0 4px ${colors.secondary}30;
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1.1rem;
  }
`;

const BookList = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
  overflow: hidden;
  border: 1px solid ${colors.background.accent};
  transition: ${transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.xl};
    border-color: ${colors.secondary}40;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0;

  th {
    background: ${gradients.primary};
    color: white;
    font-weight: ${typography.fontWeights.semibold};
    padding: 1rem;
    text-align: left;
    font-size: 0.95rem;
    white-space: nowrap;
  }

  td {
    padding: 1rem;
    vertical-align: middle;
    color: ${colors.text.secondary};
    border-bottom: 1px solid ${colors.background.accent};
    font-size: 0.95rem;
    background: ${colors.background.primary};
    transition: ${transitions.default};
  }

  tr:hover td {
    background: ${colors.background.secondary};
  }

  tr:last-child td {
    border-bottom: none;
  }

  .book-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
      width: 48px;
      height: 64px;
      object-fit: cover;
      border-radius: ${borderRadius.md};
      box-shadow: ${shadows.sm};
    }

    .book-details {
      a {
        color: ${colors.text.primary};
        text-decoration: none;
        font-weight: ${typography.fontWeights.medium};
        transition: ${transitions.default};

        &:hover {
          color: ${colors.secondary};
        }
      }

      .author {
        color: ${colors.text.secondary};
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }
    }
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border-radius: ${borderRadius.lg};
  color: ${colors.secondary};
  background: ${colors.background.accent};
  border: none;
  margin-right: 0.5rem;
  transition: ${transitions.default};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;

  svg {
    font-size: 0.9rem;
  }

  &:hover {
    background: ${colors.secondary};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  &:focus {
    box-shadow: 0 0 0 3px ${colors.secondary}20;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${typography.fonts.heading};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeights.bold};
  margin-bottom: 1rem;
  margin-top: 5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 2fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const StatCard = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  padding: 1rem;
  border: 1px solid ${colors.background.accent};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: ${transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: ${borderRadius.lg};
    background: ${colors.background.accent};
    color: ${colors.secondary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .content {
    h3 {
      color: ${colors.text.secondary};
      font-size: 0.8rem;
      margin: 0;
      font-weight: ${typography.fontWeights.medium};
    }

    .value {
      color: ${colors.text.primary};
      font-size: 1.25rem;
      font-weight: ${typography.fontWeights.bold};
      margin: 0;
      font-family: ${typography.fonts.heading};
    }
  }
`;

const ProfilePage = () => {
  const { userInfo, authAxios, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);

      // Fetch user's bookmarks and reading history
      fetchUserData();
    }
  }, [userInfo]);

  const fetchUserData = async () => {
    try {
      setLoadingBookmarks(true);

      // Get all books first
      const { data: allBooks } = await authAxios.get("/api/books");

      // Get reading progress for each book
      const progressPromises = allBooks.map((book) =>
        authAxios
          .get(`/api/books/${book._id}/progress`)
          .then((response) => ({
            book,
            ...response.data,
            isBookmarked: response.data.isBookmarked || false,
            lastReadAt: response.data.lastReadAt || new Date().toISOString(),
            currentChapter: response.data.currentChapter || 0,
          }))
          .catch(() => ({
            book,
            isBookmarked: false,
            lastReadAt: new Date().toISOString(),
            currentChapter: 0,
          }))
      );

      const booksWithProgress = await Promise.all(progressPromises);

      // Filter bookmarks and reading history
      const bookmarkedBooks = booksWithProgress.filter(
        (item) => item.isBookmarked
      );
      const recentReads = booksWithProgress
        .filter((item) => item.lastReadAt) // Only include books that have been read
        .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
        .slice(0, 10);

      setBookmarks(bookmarkedBooks);
      setReadingHistory(recentReads);
      setLoadingBookmarks(false);
    } catch {
      setLoadingBookmarks(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoadingProfile(true);

      await updateProfile({
        name,
        email,
        password: password ? password : undefined,
      });

      setSuccess(true);
      setLoadingProfile(false);
      toast.success("Profile updated successfully");

      // Clear password fields after successful update
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Update failed"
      );
      setLoadingProfile(false);
    }
  };

  return (
    <PageContainer>
      <ContentGrid>
        <div>
          <ProfileCard>
            <ProfileHeader>
              <div className="profile-icon">
                <FaUser size={24} />
              </div>
              <div>
                <h2>{name}</h2>
                <p>{email}</p>
              </div>
            </ProfileHeader>
            {success && <Message variant="success">Profile Updated</Message>}
            {loadingProfile && <Loader />}
            <StyledForm onSubmit={submitHandler}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <Form.Text>Leave blank to keep current password</Form.Text>
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Form.Group>

              <Button type="submit" className="w-100">
                Update Profile
              </Button>
            </StyledForm>
          </ProfileCard>
        </div>

        <div>
          <StatsRow>
            {/* <StatCard>
              <div className="icon">
                <FaBook />
              </div>
              <div className="content">
                <h3>Total Books Read</h3>
                <p className="value">{readingHistory.length}</p>
              </div>
            </StatCard> */}
            {/* <StatCard>
              <div className="icon">
                <FaBookmark />
              </div>
              <div className="content">
                <h3>Bookmarked Books</h3>
                <p className="value">{bookmarks.length}</p>
              </div>
            </StatCard> */}
          </StatsRow>

          <SectionTitle>
            <FaBookmark /> My Bookmarks
          </SectionTitle>
          {loadingBookmarks ? (
            <Loader />
          ) : bookmarks.length === 0 ? (
            <Message>You haven't bookmarked any books yet</Message>
          ) : (
            <BookList>
              <TableContainer>
                <StyledTable>
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Progress</th>
                      <th>Last Read</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookmarks.map((item) => (
                      <tr key={item.book._id}>
                        <td>
                          <div className="book-info">
                            <img
                              src={item.book.coverImage}
                              alt={item.book.title}
                            />
                            <div className="book-details">
                              <Link to={`/book/${item.book._id}`}>
                                {item.book.title}
                              </Link>
                              <div className="author">
                                By {item.book.author.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>Chapter {item.currentChapter + 1}</td>
                        <td>
                          {new Date(item.lastReadAt).toLocaleDateString()}
                        </td>
                        <td>
                          <ActionButton as={Link} to={`/book/${item.book._id}`}>
                            <FaEye />
                          </ActionButton>
                          <ActionButton>
                            <FaEdit />
                          </ActionButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
              </TableContainer>
            </BookList>
          )}

          <SectionTitle className="mt-5">
            <FaClock /> Recent Reading History
          </SectionTitle>
          {loadingBookmarks ? (
            <Loader />
          ) : readingHistory.length === 0 ? (
            <Message>No reading history yet</Message>
          ) : (
            <BookList>
              <TableContainer>
                <StyledTable>
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Progress</th>
                      <th>Last Read</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readingHistory.map((item) => (
                      <tr key={item.book._id}>
                        <td>
                          <div className="book-info">
                            <img
                              src={item.book.coverImage}
                              alt={item.book.title}
                            />
                            <div className="book-details">
                              <Link to={`/book/${item.book._id}`}>
                                {item.book.title}
                              </Link>
                              <div className="author">
                                By {item.book.author.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>Chapter {item.currentChapter + 1}</td>
                        <td>
                          {new Date(item.lastReadAt).toLocaleDateString()}
                        </td>
                        <td>
                          <ActionButton as={Link} to={`/book/${item.book._id}`}>
                            <FaEye />
                          </ActionButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
              </TableContainer>
            </BookList>
          )}
        </div>
      </ContentGrid>
    </PageContainer>
  );
};

export default ProfilePage;
