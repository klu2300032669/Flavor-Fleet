import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, BrowserRouter, useNavigate, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Home from "./components/Home";
import Menu from "./components/Menu";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword.jsx";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/" state={{ showLoginModal: true }} />;
};

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [scrollToOffers, setScrollToOffers] = useState(false);
  const isExcludedPage = ["/menu", "/contact-us", "/aboutus", "/checkout", "/order-success", "/profile", "/change-password"].includes(location.pathname);

  useEffect(() => {
    if (scrollToOffers && location.pathname === "/menu" && menuRef.current) {
      menuRef.current.scrollToOffers();
      setScrollToOffers(false);
    }
  }, [location.pathname, scrollToOffers]);

  const handleOffersClick = () => {
    if (location.pathname !== "/menu") {
      setScrollToOffers(true);
      navigate("/menu");
    } else if (menuRef.current) {
      menuRef.current.scrollToOffers();
    }
  };

  const handleAuthSuccess = (intendedPath) => {
    // Navigate to the intended path after successful login
    navigate(intendedPath || "/menu");
  };

  return (
    <div className="App">
      {!isExcludedPage && <Header onOffersClick={handleOffersClick} />}
      <main>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route
            path="/menu"
            element={
              <PrivateRoute>
                <Menu ref={menuRef} />
              </PrivateRoute>
            }
          />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <PrivateRoute>
                <OrderSuccess />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {!isExcludedPage && <Footer />}
      {!isExcludedPage && <LoginModal onLoginSuccess={handleAuthSuccess} />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;