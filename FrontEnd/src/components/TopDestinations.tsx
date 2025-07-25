import React from 'react';
import { Container, Carousel } from 'react-bootstrap';
import BengaluruImg from '../assets/Bengaluru.png';
import ChennaiImg from '../assets/Chennai.png';
import MumbaiImg from '../assets/Mumbai.png';

const TopDestinations = () => {
  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Our Top Locations</h2>
      <Carousel interval={2000}> {/* Auto-slide every 3 seconds */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={BengaluruImg}
            alt="Bengaluru"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>Bengaluru</h3>
            <p>India's Silicon Valley with vibrant culture.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={ChennaiImg}
            alt="Chennai"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>Chennai</h3>
            <p>Gateway to South India with rich heritage.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={MumbaiImg}
            alt="Mumbai"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>Mumbai</h3>
            <p>The city of dreams and Bollywood.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default TopDestinations;
