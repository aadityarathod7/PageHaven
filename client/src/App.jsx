// client/src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import React, { lazy, useEffect } from "react";
import Loader from "./components/Loader";
import NavigationSpinner from "./components/NavigationSpinner";

// Bootstrap and custom styles
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import LazyRoute from "./components/LazyRoute";

// Lazy load pages
const HomePage = lazy(() => import("./pages/HomePage"));
const BookPage = lazy(() => import("./pages/BookPage"));
const BooksPage = lazy(() => import("./pages/BooksPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ReadBookPage = lazy(() => import("./pages/ReadBookPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminBookListPage = lazy(() => import("./pages/AdminBookListPage"));
const AdminBookEditPage = lazy(() => import("./pages/AdminBookEditPage"));
const AdminBookCreatePage = lazy(() => import("./pages/AdminBookCreatePage"));
const AdminUserListPage = lazy(() => import("./pages/AdminUserListPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const PurchasedBooks = lazy(() => import("./pages/PurchasedBooks"));

// Route change handler component
const RouteChangeHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Preload the component for the current route
    const preloadRoute = async () => {
      try {
        switch (location.pathname) {
          case "/":
            await HomePage._payload._result();
            break;
          case "/books":
            await BooksPage._payload._result();
            break;
          // Add other routes as needed
        }
      } catch {
        // Ignore preloading errors
      }
    };

    preloadRoute();
  }, [location]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationSpinner />
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <RouteChangeHandler />
          <Header />
          <main className="py-3" style={{ flex: 1 }}>
            <Container>
              <React.Suspense fallback={<Loader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <LazyRoute>
                        <HomePage />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/books"
                    element={
                      <LazyRoute>
                        <BooksPage />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/books/page/:pageNumber"
                    element={
                      <LazyRoute>
                        <BooksPage />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/search/:query"
                    element={
                      <LazyRoute>
                        <SearchResults />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/page/:pageNumber"
                    element={
                      <LazyRoute>
                        <HomePage />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/search/:keyword/page/:pageNumber"
                    element={
                      <LazyRoute>
                        <HomePage />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/book/:id"
                    element={
                      <LazyRoute>
                        <BookPage />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <LazyRoute>
                        <LoginPage />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <LazyRoute>
                        <RegisterPage />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/privacy"
                    element={
                      <LazyRoute>
                        <PrivacyPolicy />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <LazyRoute>
                        <Terms />
                      </LazyRoute>
                    }
                  />

                  {/* Private Routes */}
                  <Route
                    path="/favorites"
                    element={
                      <PrivateRoute>
                        <LazyRoute>
                          <FavoritesPage />
                        </LazyRoute>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/read/:id"
                    element={
                      <PrivateRoute>
                        <LazyRoute>
                          <ReadBookPage />
                        </LazyRoute>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <LazyRoute>
                          <ProfilePage />
                        </LazyRoute>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <PrivateRoute>
                        <LazyRoute>
                          <CheckoutPage />
                        </LazyRoute>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/payment-success"
                    element={
                      <PrivateRoute>
                        <LazyRoute>
                          <PaymentSuccessPage />
                        </LazyRoute>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute>
                        <LazyRoute>
                          <OrdersPage />
                        </LazyRoute>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-books"
                    element={
                      <PrivateRoute>
                        <LazyRoute>
                          <PurchasedBooks />
                        </LazyRoute>
                      </PrivateRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <LazyRoute>
                          <AdminDashboardPage />
                        </LazyRoute>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/books"
                    element={
                      <AdminRoute>
                        <LazyRoute>
                          <AdminBookListPage />
                        </LazyRoute>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/book/create"
                    element={
                      <AdminRoute>
                        <LazyRoute>
                          <AdminBookCreatePage />
                        </LazyRoute>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/book/:id/edit"
                    element={
                      <AdminRoute>
                        <LazyRoute>
                          <AdminBookEditPage />
                        </LazyRoute>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <LazyRoute>
                          <AdminUserListPage />
                        </LazyRoute>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <LazyRoute>
                          <AdminOrdersPage />
                        </LazyRoute>
                      </AdminRoute>
                    }
                  />
                </Routes>
              </React.Suspense>
            </Container>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
