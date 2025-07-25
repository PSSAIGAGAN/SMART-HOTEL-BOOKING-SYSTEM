// components/HotelCard.tsx
import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom'; // No longer navigate directly from here

// Define the Hotel interface
interface Hotel {
  hotelId: number;
  name: string;
  location: string;
  amenities: string;
  rating?: number;
  url: string;
  minPrice?: number;
}

// Define props for HotelCard to include the onClick handler
interface HotelCardProps {
  hotel: Hotel;
  onClick: () => void; // Function to handle click, passed from parent
}

const HotelCard = ({ hotel, onClick }: HotelCardProps) => { // Accept onClick prop
  // const navigate = useNavigate(); // No longer needed here

  // const handleClick = () => { // This function is now replaced by the passed onClick
  //   navigate(`/manage-rooms?hotelId=${hotel.hotelId}`);
  // };

  return (
    <Card className="mb-3 shadow-sm" onClick={onClick} style={{ cursor: 'pointer' }}> {/* ⭐ Use onClick prop here */}
      <Row className="g-0 align-items-center">
        <Col md={4}>
          <Card.Img
            src={hotel.url || "https://via.placeholder.com/300x200?text=Hotel+Image"}
            alt={hotel.name}
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </Col>

        <Col md={6}>
          <Card.Body>
            <Card.Title>{hotel.name}</Card.Title>
            <Card.Text>
              <strong>Location:</strong> {hotel.location} <br />
              <strong>Amenities:</strong> {hotel.amenities} <br />
              <strong>Rating:</strong>{' '}
              {hotel.rating != null && hotel.rating > 0 ? (
                `${hotel.rating.toFixed(1)} ⭐`
              ) : (
                'Not Rated Yet'
              )}
            </Card.Text>
            <h5 className="text-success">
              {hotel.minPrice != null ? (
                `Starting from ₹${hotel.minPrice.toFixed(0)}`
              ) : (
                'No available rooms / Price N/A'
              )}
            </h5>
          </Card.Body>
        </Col>

        <Col md={2} className="d-flex justify-content-center">
          <Button
            variant="success"
            className="align-self-center"
            style={{ backgroundColor: '#4caf50', borderColor: '#4caf50', whiteSpace: 'nowrap' }}
            onClick={onClick} // ⭐ Ensure the button also triggers the navigation
          >
            Book Now
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default HotelCard;