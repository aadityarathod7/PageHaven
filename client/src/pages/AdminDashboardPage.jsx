import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaBook,
  FaUser,
  FaDownload,
  FaEye,
  FaChartLine,
  FaShoppingCart,
  FaPlus,
  FaList,
  FaUsers,
  FaEdit,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  colors,
  typography,
  shadows,
  transitions,
  borderRadius,
  commonStyles,
} from "../styles/theme";
import { API_URL, UPLOADS_URL } from "../config/config";

const PageContainer = styled.div`
  padding: 2rem;
  margin-top: 80px;
  max-width: 1200px;
  margin: 80px auto 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
<<<<<<< HEAD
  margin: 2.5rem 0 2rem;
  padding: 0 1rem;
=======
  margin-bottom: 2rem;
>>>>>>> b71585729ff5b822d4dca67b5ea7eaa064d8b14a

  h1 {
    font-family: ${typography.fonts.heading};
    color: ${colors.text.primary};
    font-size: 1.75rem;
    font-weight: ${typography.fontWeights.bold};
    margin: 0;
    position: relative;
    padding-bottom: 1rem;

    &::after {
      content: "";
      position: absolute;
      bottom: -12px;
      left: 0;
      width: 40px;
      height: 2px;
      background: ${colors.secondary};
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 80px;
    }

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`;

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.secondary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: ${borderRadius.lg};
  text-decoration: none;
  font-weight: ${typography.fontWeights.semibold};
  transition: ${transitions.default};
  box-shadow: ${shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    background: ${colors.primary};
    color: white;
  }
`;

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.secondary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: ${borderRadius.lg};
  text-decoration: none;
  font-weight: ${typography.fontWeights.semibold};
  transition: ${transitions.default};
  box-shadow: ${shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    background: ${colors.primary};
    color: white;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  padding: 1.5rem;
  box-shadow: ${shadows.md};
  transition: ${transitions.default};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.lg};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: ${borderRadius.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    background: ${(props) =>
      props.$variant === "success"
        ? `${colors.success}15`
        : props.$variant === "warning"
        ? `${colors.warning}15`
        : props.$variant === "info"
        ? `${colors.secondary}15`
        : `${colors.primary}15`};
    color: ${(props) =>
      props.$variant === "success"
        ? colors.success
        : props.$variant === "warning"
        ? colors.warning
        : props.$variant === "info"
        ? colors.secondary
        : colors.primary};
  }
`;

const StatTitle = styled.h6`
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
  font-weight: ${typography.fontWeights.medium};
`;

const StatValue = styled.h3`
  color: ${colors.text.primary};
  font-size: 1.5rem;
  font-weight: ${typography.fontWeights.bold};
  margin: 0;
  font-family: ${typography.fonts.heading};
`;

const StatFooter = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.background.accent};

  a {
    color: ${(props) =>
      props.$variant === "success"
        ? colors.success
        : props.$variant === "warning"
        ? colors.warning
        : props.$variant === "info"
        ? colors.secondary
        : colors.primary};
    text-decoration: none;
    font-weight: ${typography.fontWeights.medium};
    font-size: 0.875rem;
    transition: ${transitions.default};

    &:hover {
      opacity: 0.8;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContentCard = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.md};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${colors.background.accent};

  h5 {
    font-family: ${typography.fonts.heading};
    color: ${colors.text.primary};
    font-size: 1.25rem;
    font-weight: ${typography.fontWeights.bold};
    margin: 0;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const BookList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BookItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.background.accent};

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  img {
    width: 60px;
    height: 80px;
    object-fit: cover;
    border-radius: ${borderRadius.md};
    box-shadow: ${shadows.sm};
    transition: ${transitions.default};

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const BookInfo = styled.div`
  flex: 1;

  h6 {
    margin: 0 0 0.25rem;
    font-weight: ${typography.fontWeights.semibold};

    a {
      color: ${colors.text.primary};
      text-decoration: none;
      transition: ${transitions.default};

      &:hover {
        color: ${colors.secondary};
      }
    }
  }

  small {
    color: ${colors.text.secondary};
    font-size: 0.875rem;
  }
`;

const BookStats = styled.div`
  display: flex;
  gap: 1rem;
  color: ${colors.text.secondary};
  font-size: 0.875rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: ${borderRadius.full};
  font-size: 0.75rem;
  font-weight: ${typography.fontWeights.medium};
  background: ${(props) =>
    props.$status === "published"
      ? `${colors.success}15`
      : `${colors.warning}15`};
  color: ${(props) =>
    props.$status === "published" ? colors.success : colors.warning};
  margin-top: 0.5rem;
`;

const AdminMenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const AdminMenuCard = styled(Link)`
  ${commonStyles.cardStyle}
  padding: 2rem 1.5rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
<<<<<<< HEAD
    transform: translateY(-4px) scale(1.01);
=======
    transform: translateY(-6px) scale(1.02);
>>>>>>> b71585729ff5b822d4dca67b5ea7eaa064d8b14a
    box-shadow: ${shadows.lg};
    background: rgba(255, 255, 255, 0.8);
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: ${borderRadius.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    background: ${(props) =>
      props.$color === "primary"
        ? `${colors.primary}15`
        : props.$color === "secondary"
        ? `${colors.secondary}15`
        : props.$color === "success"
        ? `${colors.success}15`
        : props.$color === "warning"
        ? `${colors.warning}15`
        : `${colors.accent}15`};
    color: ${(props) =>
      props.$color === "primary"
        ? colors.primary
        : props.$color === "secondary"
        ? colors.secondary
        : props.$color === "success"
        ? colors.success
        : props.$color === "warning"
        ? colors.warning
        : colors.accent};
    transition: ${transitions.default};
  }

  h3 {
    color: ${colors.text.primary};
<<<<<<< HEAD
    font-size: 1.15rem;
    font-weight: ${typography.fontWeights.bold};
    margin: 1.5rem 0 1rem;
=======
    font-size: 1.25rem;
    font-weight: ${typography.fontWeights.bold};
    margin-bottom: 0.5rem;
>>>>>>> b71585729ff5b822d4dca67b5ea7eaa064d8b14a
    font-family: ${typography.fonts.heading};
  }

  p {
    color: ${colors.text.secondary};
<<<<<<< HEAD
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.6;
=======
    font-size: 0.95rem;
    margin: 0;
>>>>>>> b71585729ff5b822d4dca67b5ea7eaa064d8b14a
  }
`;

const SectionHeader = styled.h2`
  font-family: ${typography.fonts.heading};
  color: ${colors.text.primary};
<<<<<<< HEAD
  font-size: 1.5rem;
  font-weight: ${typography.fontWeights.bold};
  margin: 3rem 0 2rem;
  padding: 0 1rem 1rem;
  position: relative;
  border-bottom: none;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 1rem;
    width: 40px;
    height: 2px;
    background: ${colors.secondary};
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 80px;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin: 2.5rem 0 1.75rem;
  }
=======
  font-size: 1.75rem;
  font-weight: ${typography.fontWeights.bold};
  margin: 3rem 0 1.5rem;
  border-bottom: 2px solid ${colors.background.accent};
  padding-bottom: 0.75rem;
>>>>>>> b71585729ff5b822d4dca67b5ea7eaa064d8b14a
`;

const AdminDashboardPage = () => {
  const { authAxios } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalReads: 0,
    totalDownloads: 0,
    totalOrders: 0,
    recentBooks: [],
    topBooks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [booksResponse, usersResponse, ordersResponse] =
          await Promise.all([
            authAxios.get("/api/books/admin/books"),
            authAxios.get("/api/users"),
            authAxios.get("/api/orders/admin"),
          ]);

        const books = booksResponse.data;
        const users = usersResponse.data;
        const orders = ordersResponse.data;

        const totalBooks = books.length;
        const totalUsers = users.length;
        const totalOrders = orders.length;
        const totalReads = books.reduce((sum, book) => sum + book.readCount, 0);
        const totalDownloads = books.reduce(
          (sum, book) => sum + book.downloads,
          0
        );

        const recentBooks = [...books]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        const topBooks = [...books]
          .sort((a, b) => b.readCount - a.readCount)
          .slice(0, 5);

        setStats({
          totalBooks,
          totalUsers,
          totalReads,
          totalDownloads,
          totalOrders,
          recentBooks,
          topBooks,
        });

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

    fetchDashboardData();
  }, [authAxios]);

  return (
    <PageContainer>
      <PageHeader>
        <h1>Admin Dashboard</h1>
<<<<<<< HEAD
        {/* <CreateButton to="/admin/book/create">
          <FaPlus /> Add New Book
        </CreateButton> */}
=======
        <CreateButton to="/admin/book/create">
          <FaPlus /> Add New Book
        </CreateButton>
>>>>>>> b71585729ff5b822d4dca67b5ea7eaa064d8b14a
      </PageHeader>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <AdminMenuGrid>
            <AdminMenuCard to="/admin/books" $color="primary">
              <div className="icon-wrapper">
                <FaList size={28} />
              </div>
              <h3>Manage Books</h3>
              <p>View, edit and delete books</p>
            </AdminMenuCard>

            <AdminMenuCard to="/admin/book/create" $color="secondary">
              <div className="icon-wrapper">
                <FaPlus size={28} />
              </div>
              <h3>Add New Book</h3>
              <p>Create a new book</p>
            </AdminMenuCard>

            <AdminMenuCard to="/admin/users" $color="success">
              <div className="icon-wrapper">
                <FaUsers size={28} />
              </div>
              <h3>Manage Users</h3>
              <p>View and manage user accounts</p>
            </AdminMenuCard>

            <AdminMenuCard to="/admin/orders" $color="warning">
              <div className="icon-wrapper">
                <FaShoppingCart size={28} />
              </div>
              <h3>Manage Orders</h3>
              <p>View and process orders</p>
            </AdminMenuCard>
          </AdminMenuGrid>

          <SectionHeader>Dashboard Statistics</SectionHeader>

          <StatsGrid>
            <StatCard>
              <StatHeader>
                <div className="icon-wrapper">
                  <FaBook size={24} />
                </div>
                <div>
                  <StatTitle>Total Books</StatTitle>
                  <StatValue>{stats.totalBooks}</StatValue>
                </div>
              </StatHeader>
              <StatFooter>
                <Link to="/admin/books">View all books</Link>
              </StatFooter>
            </StatCard>

            <StatCard>
              <StatHeader $variant="success">
                <div className="icon-wrapper">
                  <FaUser size={24} />
                </div>
                <div>
                  <StatTitle>Total Users</StatTitle>
                  <StatValue>{stats.totalUsers}</StatValue>
                </div>
              </StatHeader>
              <StatFooter $variant="success">
                <Link to="/admin/users">View all users</Link>
              </StatFooter>
            </StatCard>

            <StatCard>
              <StatHeader $variant="warning">
                <div className="icon-wrapper">
                  <FaShoppingCart size={24} />
                </div>
                <div>
                  <StatTitle>Total Orders</StatTitle>
                  <StatValue>{stats.totalOrders}</StatValue>
                </div>
              </StatHeader>
              <StatFooter $variant="warning">
                <Link to="/admin/orders">View all orders</Link>
              </StatFooter>
            </StatCard>

            <StatCard>
              <StatHeader $variant="info">
                <div className="icon-wrapper">
                  <FaEye size={24} />
                </div>
                <div>
                  <StatTitle>Total Reads</StatTitle>
                  <StatValue>{stats.totalReads}</StatValue>
                </div>
              </StatHeader>
              <StatFooter $variant="info">
                <span>All time reads</span>
              </StatFooter>
            </StatCard>

            <StatCard>
              <StatHeader $variant="warning">
                <div className="icon-wrapper">
                  <FaDownload size={24} />
                </div>
                <div>
                  <StatTitle>Total Downloads</StatTitle>
                  <StatValue>{stats.totalDownloads}</StatValue>
                </div>
              </StatHeader>
              <StatFooter $variant="warning">
                <span>All time downloads</span>
              </StatFooter>
            </StatCard>
          </StatsGrid>

          <ContentGrid>
            <ContentCard>
              <CardHeader>
                <h5>Recently Added Books</h5>
              </CardHeader>
              <CardBody>
                {stats.recentBooks.length > 0 ? (
                  <BookList>
                    {stats.recentBooks.map((book) => (
                      <BookItem key={book._id}>
                        <img
                          src={
                            book.coverImage.startsWith("/uploads")
                              ? `${API_URL}${book.coverImage}`
                              : book.coverImage
                          }
                          alt={book.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${API_URL}/uploads/default-cover.jpg`;
                          }}
                        />
                        <BookInfo>
                          <h6>
                            <Link to={`/book/${book._id}`}>{book.title}</Link>
                          </h6>
                          <small>
                            Added{" "}
                            {new Date(book.createdAt).toLocaleDateString()}
                          </small>
                          <StatusBadge $status={book.status}>
                            {book.status}
                          </StatusBadge>
                        </BookInfo>
                      </BookItem>
                    ))}
                  </BookList>
                ) : (
                  <p>No books added yet</p>
                )}
              </CardBody>
            </ContentCard>

            <ContentCard>
              <CardHeader>
                <h5>Top Books by Reads</h5>
              </CardHeader>
              <CardBody>
                {stats.topBooks.length > 0 ? (
                  <BookList>
                    {stats.topBooks.map((book) => (
                      <BookItem key={book._id}>
                        <img
                          src={
                            book.coverImage.startsWith("/uploads")
                              ? `${API_URL}${book.coverImage}`
                              : book.coverImage
                          }
                          alt={book.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${API_URL}/uploads/default-cover.jpg`;
                          }}
                        />
                        <BookInfo>
                          <h6>
                            <Link to={`/book/${book._id}`}>{book.title}</Link>
                          </h6>
                          <small>By {book.author.name}</small>
                        </BookInfo>
                        <BookStats>
                          <div>
                            <FaEye /> {book.readCount}
                          </div>
                          <div>
                            <FaDownload /> {book.downloads}
                          </div>
                        </BookStats>
                      </BookItem>
                    ))}
                  </BookList>
                ) : (
                  <p>No books read yet</p>
                )}
              </CardBody>
            </ContentCard>
          </ContentGrid>
        </>
      )}
    </PageContainer>
  );
};

export default AdminDashboardPage;
