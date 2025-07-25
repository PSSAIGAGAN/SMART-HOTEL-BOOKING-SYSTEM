// pages/Home.tsx
import React, { useRef, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import TopDestinations from '../components/TopDestinations';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const aboutUsRef = useRef<HTMLDivElement>(null); // ⭐ New ref for About Us section
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get("scroll"); // Get the scroll target from URL params

    if (scrollTarget === "search") {
      setTimeout(() => {
        searchRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // slight delay ensures DOM is ready
    } else if (scrollTarget === "about") { // ⭐ Handle "about" scroll target
      setTimeout(() => {
        aboutUsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]); // Depend on location to re-run when URL changes

  return (
    <div>
      <CustomNavbar />

      <Container className="text-center mt-5">
        <br /><br /><br />
        <h1>Find Your Perfect Stay</h1>
        <p>Effortless booking, handcrafted comfort.</p>
      </Container>

      <br />
      <div ref={searchRef}>
        <SearchBar />
      </div>
      <br /><br />
      <TopDestinations />
      <br />
      {/* About Us Section */}
      {/* ⭐ Assign the new ref to the About Us Container */}
      <Container id="about" className="mt-5" ref={aboutUsRef}>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h3>About Us</h3>
            <p className="mt-3">
              At <strong>hopNstay</strong>, we believe travel should be seamless and memorable. Whether you're planning a quick getaway or a long vacation, we combine technology and thoughtful design to help you discover stays that feel just right.
            </p>
            <p>
              From curated destinations to loyalty rewards, our goal is to make your journey as delightful as your destination. Explore, book, and stay with ease — because every journey deserves a comfortable beginning.
            </p>
          </Col>
        </Row>
      </Container>

      <br /><br />
      <Footer />
    </div>
  );
};

export default Home;