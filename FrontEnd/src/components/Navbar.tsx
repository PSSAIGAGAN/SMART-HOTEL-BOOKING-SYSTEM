// components/Navbar.tsx
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { useNavigate, Link, useLocation } from "react-router-dom"; // ⭐ Import useLocation
import { FaUserCircle } from 'react-icons/fa';

const CustomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ⭐ Get current location
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";
  const userType = (window.localStorage.getItem("userType") || "").toLowerCase().trim();
  console.log(userType);
  
  const isStandardUser = isLoggedIn && (userType === "admin" || userType === "hotel_manager");

  const handleSearchClick = () => {
    navigate('/?scroll=search');
  };

  // ⭐ New handler for About Us click
  const handleAboutUsClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link behavior
    if (location.pathname === '/') {
      // If already on the homepage, just scroll
      const aboutUsSection = document.getElementById('about');
      if (aboutUsSection) {
        aboutUsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on the homepage, navigate and then scroll
      navigate('/?scroll=about');
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar" sticky="top">
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to="/" className="navbar-logo-wrapper">
          <img
            src="src/assets/logo1.png"
            alt="hopNstay Logo"
            className="navbar-logo"
          />
          <span className="brand-name">hopNstay</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="nav-collapse" className="custom-toggler" />
        <Navbar.Collapse id="nav-collapse">
          <Nav className="ms-auto align-items-center">
            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link> {/* Changed to Link for consistency */}
                <Nav.Link onClick={handleSearchClick}>Search</Nav.Link>
                {/* ⭐ Changed href to onClick for About Us */}
                <Nav.Link onClick={handleAboutUsClick}>About Us</Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  className="signup-btn"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}

            {isLoggedIn && !isStandardUser && (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link onClick={handleSearchClick}>Search</Nav.Link>
                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                <Nav.Link as={Link} to="/loyalty">Loyalty Points</Nav.Link>
                {/* ⭐ Changed href to onClick for About Us */}
                <Nav.Link onClick={handleAboutUsClick}>About Us</Nav.Link>
                <FaUserCircle
                  className="user-avatar"
                  onClick={() => navigate("/userDetails")}
                />
              </>
            )}

            {isLoggedIn && isStandardUser && (
              <>
                {/* For standard users (admin/hotel_manager), decide what links they need.
                    Assuming they might still need a way to go "Home" or to "About Us"
                    but perhaps not "My Bookings" or "Loyalty Points".
                    Adjust these links based on your application's user flow for these roles.
                */}

                <FaUserCircle
                  className="user-avatar"
                  onClick={() => navigate("/userDetails")}
                />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;