import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './Userdetails.css';
import EditUserModal from './EditUserModal';
import { FaUserCircle, FaRegEdit, FaBars } from 'react-icons/fa';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Offcanvas,
  Navbar
} from 'react-bootstrap';

interface UserData {
  userId: number;
  name: string;
  email: string;
  contactNumber: number;
  roles: Array<{ roleName: string }>;
}

const Userdetails: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload: any = jwtDecode(token);
      const userId = payload.userId;

      fetch(`http://localhost:9999/user-api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch user');
          return res.json();
        })
        .then((data: UserData) => setUserData(data))
        .catch((err) => {
          console.error('User fetch error:', err);
          navigate('/login');
        });
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Container fluid className="user-panel">
      {/* Mobile Navbar */}
      <Navbar bg="dark" variant="dark" className="d-md-none px-3 py-2">
        <Button variant="outline-light" onClick={() => setShowSidebar(true)}>
          <FaBars />
        </Button>
        <Navbar.Brand className="ms-2">User Panel</Navbar.Brand>
      </Navbar>

      {/* Mobile Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className="user-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Hello, {userData?.name || 'User'}!
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="text-center">
          <FaUserCircle className="user-avatar" />
          <h5 className="user-name">{userData?.name}</h5>
          <p>{userData?.email}</p>
          <Button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      <Row className="flex-nowrap min-vh-100">
        {/* Desktop Sidebar */}
        <Col md={3} className="sidebar d-none d-md-block">
          <div className="sidebar-header text-center">
            <FaUserCircle className="user-avatar" />
            <h5 className="user-name">{userData?.name}</h5>
            <p>{userData?.email}</p>
            <Button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </Button>
          </div>
        </Col>

        {/* Main Content */}
        <Col className="main-content">
          <Row className="header-row mb-4">
            <Col>
              <h4>Hello, {userData?.name}!</h4>
            </Col>
          </Row>

          <Card className="info-card mb-4 fade-in">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Personal Information</h5>
              <FaRegEdit
                className="edit-icon"
                title="Edit Personal Info"
                onClick={() => setShowEditModal(true)}
              />
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Name</h6>
                  <p>{userData?.name}</p>
                </Col>
                <Col md={6}>
                  <h6>Email</h6>
                  <p>{userData?.email}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="info-card mb-5 fade-in">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Contact Information</h5>
              <FaRegEdit
                className="edit-icon"
                title="Edit Contact Info"
                onClick={() => setShowEditModal(true)}
              />
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Phone</h6>
                  <p>{userData?.contactNumber}</p>
                </Col>
                <Col md={6}>
                  <h6>Email</h6>
                  <p>{userData?.email}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      {userData && (
        <EditUserModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          userData={userData}
          onUpdate={setUserData}
        />
      )}
    </Container>
  );
};

export default Userdetails;
