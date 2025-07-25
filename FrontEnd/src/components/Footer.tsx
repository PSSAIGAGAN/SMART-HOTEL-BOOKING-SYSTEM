import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from 'react-icons/fa';
import './Footer.css';
 
const Footer: React.FC = () => {
  return (
    <footer className="bg-dark border-top border-success text-white">
      <Container fluid className="py-4 px-3">
        <Row className="align-items-center justify-content-between">
          {/* Social Icons */}
          <Col
            xs={12}
            md="auto"
            className="mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start"
          >
            <a href="https://facebook.com" className="text-white mx-2" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" className="text-white mx-2" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" className="text-white mx-2" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" className="text-white mx-2" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </Col>
 
          {/* Copyright */}
          <Col xs={12} md="auto" className="text-center text-md-end">
            <small className="text-muted">
              © {new Date().getFullYear()} hopNstay. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
 
export default Footer;