// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';

// Bootstrap and custom styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import BooksPage from './pages/BooksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReadBookPage from './pages/ReadBookPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBookListPage from './pages/AdminBookListPage';
import AdminBookEditPage from './pages/AdminBookEditPage';
import AdminBookCreatePage from './pages/AdminBookCreatePage';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import SearchResults from './pages/SearchResults';
import FavoritesPage from './pages/FavoritesPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/page/:pageNumber" element={<BooksPage />} />
              <Route path="/search/:query" element={<SearchResults />} />
              <Route path="/page/:pageNumber" element={<HomePage />} />
              <Route path="/search/:keyword/page/:pageNumber" element={<HomePage />} />
              <Route path="/book/:id" element={<BookPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Private Routes */}
              <Route 
                path="/favorites" 
                element={
                  <PrivateRoute>
                    <FavoritesPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/read/:id" 
                element={
                  <PrivateRoute>
                    <ReadBookPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/payment-success" 
                element={
                  <PrivateRoute>
                    <PaymentSuccessPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <PrivateRoute>
                    <OrdersPage />
                  </PrivateRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/books" 
                element={
                  <AdminRoute>
                    <AdminBookListPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/book/create" 
                element={
                  <AdminRoute>
                    <AdminBookCreatePage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/book/:id/edit" 
                element={
                  <AdminRoute>
                    <AdminBookEditPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <AdminUserListPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <AdminRoute>
                    <AdminOrdersPage />
                  </AdminRoute>
                } 
              />
            </Routes>
          </Container>
        </main>
        <Footer />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;