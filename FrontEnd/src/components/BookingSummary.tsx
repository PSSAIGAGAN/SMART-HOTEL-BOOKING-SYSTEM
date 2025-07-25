// BookingSummary.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parseISO, isValid, differenceInDays } from 'date-fns';
import axios from 'axios';

import { Container, Card, Row, Col, ListGroup, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const BACKEND_BASE_URL = 'http://localhost:9095/api';
const HOTEL_BASE_URL = 'http://localhost:8083/api/hotels';
const ROOM_BASE_URL = 'http://localhost:8082/api/rooms';
const LOYALTY_BASE_URL = 'http://localhost:9099/loyalty-api';
const REDEEM_BASE_URL = 'http://localhost:9099/redemption-api';

const BookingSummary: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');

  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return null;
  }
  const payload: any = jwtDecode(token);
  const userId = payload.userId;

  const [hotel, setHotel] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [pointsToUse, setPointsToUse] = useState<number>(0);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numberOfNights = useMemo(() => {
    if (checkInDate && checkOutDate) {
      const start = parseISO(checkInDate);
      const end = parseISO(checkOutDate);
      if (isValid(start) && isValid(end)) {
        const days = differenceInDays(end, start);
        return days > 0 ? days : 1;
      }
    }
    return 1;
  }, [checkInDate, checkOutDate]);

  const totalRoomPrice = useMemo(() => {
    return room ? room.price * numberOfNights : 0;
  }, [room, numberOfNights]);

  const finalAmount = totalRoomPrice - pointsToUse;

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [hotelRes, roomRes, loyaltyRes] = await Promise.all([
          axios.get(`${HOTEL_BASE_URL}/${hotelId}`),
          axios.get(`${ROOM_BASE_URL}/${roomId}`),
          axios.get(`${LOYALTY_BASE_URL}/getpoints/${userId}`)
        ]);

        const hotelData = hotelRes.data;
        const roomData = roomRes.data;
        const loyaltyData = loyaltyRes.data;

        setHotel(hotelData);
        setRoom(roomData);
        setLoyaltyPoints(loyaltyData);

      } catch (err: any) {
        console.error("Error fetching booking details:", err);
        setError(err.response?.data?.message || err.message || 'Failed to load booking details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (hotelId && roomId && userId) {
      fetchDetails();
    } else if (!hotelId || !roomId) {
      setError("Missing hotel ID or room ID in URL parameters.");
      setIsLoading(false);
    }
  }, [hotelId, roomId, userId]);

  useEffect(() => {
    if (room) {
      const maxApplicablePoints = Math.min(loyaltyPoints, totalRoomPrice);
      setPointsToUse(useLoyaltyPoints ? maxApplicablePoints : 0);
    }
  }, [useLoyaltyPoints, loyaltyPoints, totalRoomPrice, room]);

  const handleCheckboxChange = () => setUseLoyaltyPoints(prev => !prev);

  const handleProceed = async () => {
    setIsLoading(true);
    setError(null);

    if (!checkInDate || !checkOutDate || checkInDate.trim() === '' || checkOutDate.trim() === '') {
      setError("Check-in or Check-out date is missing or invalid.");
      setIsLoading(false);
      return;
    }

    if (finalAmount < 0) {
      setError("Calculated final amount is negative. Please adjust loyalty points.");
      setIsLoading(false);
      return;
    }

    try {
      const bookingAndPaymentDetails = {
        userId,
        roomId: room.roomId,
        checkInDate,
        checkOutDate,
        payment: {
          amount: finalAmount,
          currency: 'INR',
        },
      };

      const response = await axios.post(`${BACKEND_BASE_URL}/bookings/createWithPayment`, bookingAndPaymentDetails);

      const responseData = response.data;
      const { bookingId, orderId, amount, currency, paymentRecordId } = responseData;

      if (!bookingId || !orderId || !amount || !currency || !paymentRecordId) {
        throw new Error('Incomplete order details from backend.');
      }

      if (useLoyaltyPoints && pointsToUse > 0) {
        try {
          await axios.post(`${REDEEM_BASE_URL}/redeem/${userId}/${bookingId}/${pointsToUse}`);
          console.log(`Successfully redeemed ${pointsToUse} points for booking ${bookingId}`);
        } catch (redemptionErr: any) {
          console.error("Failed to redeem loyalty points:", redemptionErr.response?.data?.message || redemptionErr.message);
        }
      }

      navigate('/payment', {
        state: {
          amount,
          bookingId,
          orderId,
          currency,
          paymentRecordId,
          userId
        },
      });

    } catch (err: any) {
      console.error('Error during booking:', err);
      setError(err.response?.data?.message || err.message || 'Unexpected error during booking.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr || dateStr.trim() === '') {
      return '—';
    }
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, 'eeee, do MMMM, yyyy') : '—';
  };

  if (isLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading booking summary...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          Error: {error}
        </Alert>
        <div className="text-center mt-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Container>
    );
  }

  if (!hotelId || !roomId || !hotel || !room) {
    return (
      <Container className="my-5">
        <Alert variant="warning" className="text-center">
          Invalid booking details. Please go back and select a hotel and room.
        </Alert>
        <div className="text-center mt-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5 py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg">
            <Card.Header className="bg-success text-white text-center py-3">
              <Card.Title as="h2" className="mb-0 fw-bold">Booking Summary</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h3 className="fw-bold">{hotel.name}</h3>
                <p className="text-muted mb-0">{hotel.location}</p>
                <hr />
              </div>

              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <strong>Room Type:</strong> <span>{room.type}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <strong>Check-in:</strong> <span>{formatDate(checkInDate)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <strong>Check-out:</strong> <span>{formatDate(checkOutDate)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <strong>Number of Nights:</strong> <span>{numberOfNights}</span>
                </ListGroup.Item>
              </ListGroup>

              <hr />

              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <strong>Price per Night:</strong> <span>₹{room.price}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <strong>Total Room Price ({numberOfNights} nights):</strong> <span>₹{totalRoomPrice}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <strong>Loyalty Points Used:</strong> <span>- ₹{pointsToUse}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between text-success fw-bold fs-5">
                  <strong>Final Payable Amount:</strong> <span>₹{finalAmount}</span>
                </ListGroup.Item>
              </ListGroup>

              <Form.Check
                type="checkbox"
                id="loyalty-checkbox"
                label={`Redeem Loyalty Points (Available: ₹${loyaltyPoints} | Max Applicable: ₹${Math.min(loyaltyPoints, totalRoomPrice)})`}
                checked={useLoyaltyPoints}
                onChange={handleCheckboxChange}
                disabled={loyaltyPoints <= 0 || totalRoomPrice === 0}
                className="mb-4"
              />

              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

              <Button
                variant="success"
                onClick={handleProceed}
                disabled={isLoading || !checkInDate || !checkOutDate || checkInDate.trim() === '' || checkOutDate.trim() === '' || finalAmount < 0}
                className="w-100 py-2"
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Processing Booking...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingSummary;