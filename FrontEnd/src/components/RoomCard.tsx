// components/RoomCard.tsx
import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Define the Room interface as it's passed from ManageRooms
interface Room {
  roomId: number;
  hotelId: number; // Still exists, but we'll display hotelName
  type: string; // Corresponds to your 'room.type'
  price: number;
  availability: boolean;
  features: string;
  url: string; // For the room image
  hotelName: string; // This will be passed from ManageRooms
}

// Define props for RoomCard to include navigation-related items (checkInDate, checkOutDate)
interface RoomCardProps {
  room: Room;
  checkInDate: string | null; // Pass checkInDate to RoomCard
  checkOutDate: string | null; // Pass checkOutDate to RoomCard
}

// Updated RoomCard component
const RoomCard = ({ room, checkInDate, checkOutDate }: RoomCardProps) => {
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";

    if (!isLoggedIn) {
      // If user is not logged in, redirect to login page
      navigate('/login');
    } else {
      // If user is logged in, navigate to booking summary as usual
      navigate(
        `/booking-summary?hotelId=${room.hotelId}&roomId=${room.roomId}&checkInDate=${checkInDate || ''}&checkOutDate=${checkOutDate || ''}`
      );
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Row className="g-0 align-items-center">
        <Col md={4}>
          <Card.Img
            src={room.url || "https://via.placeholder.com/300x200?text=Room+Image"}
            alt={room.type}
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </Col>
        <Col md={6}>
          <Card.Body>
            <Card.Title>{room.type}</Card.Title>
            <Card.Text>
              <strong>Hotel:</strong> {room.hotelName} <br />
              <strong>Price:</strong> ₹{room.price} <br />
              <strong>Availability:</strong>{' '}
              {room.availability ? (
                <Badge bg="success">Available</Badge>
              ) : (
                <Badge bg="danger">Unavailable</Badge>
              )} <br />
              <strong>Features:</strong> {room.features}
            </Card.Text>
          </Card.Body>
        </Col>
        <Col md={2} className="d-flex justify-content-center">
          <Button
            variant="success"
            className="align-self-center"
            style={{ backgroundColor: '#4caf50', borderColor: '#4caf50' }}
            disabled={!room.availability}
            onClick={handleBookNowClick}
          >
            {room.availability ? 'Book Now' : 'Not Available'}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default RoomCard;