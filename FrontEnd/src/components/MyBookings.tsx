// pages/MyBookings.tsx
 
import React, { useEffect, useState } from 'react';
import {
  Card,
  Container,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import CustomNavbar from '../components/Navbar';
import Footer from '../components/Footer';
 
const BACKEND_BASE_URL = 'http://localhost:9095/api';
const ROOM_API_BASE_URL = 'http://localhost:8082/api/rooms';
const HOTEL_API_BASE_URL = 'http://localhost:8083/api/hotels';
const LOYALTY_API_BASE_URL = 'http://localhost:9099/loyalty-api';
 
interface Payment {
  paymentId: number;
  bookingId: number;
  userId: number;
  amount: number;
  status: string;
  paymentMethod: string;
  currency: string;
}
 
interface Booking {
  bookingId: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  payment?: Payment;
  hotelId?: number;
  hotelName?: string;
  roomType?: string;
}
 
interface Room {
  hotelId: number;
  type: string;
}
 
interface Hotel {
  name: string;
}
 
const MyBookings: React.FC = () => {
  const navigate = useNavigate();
 
  // authentication & userId
  const token = localStorage.getItem('token');
  const storedUserId = localStorage.getItem('userId');
  if (!token || !storedUserId) {
    navigate('/login');
    return null;
  }
  const userId = Number(storedUserId);
 
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
 
      try {
        // 1) fetch user's bookings (payment block embedded)
        const res = await fetch(
          `${BACKEND_BASE_URL}/bookings/user/${userId}`
        );
        if (!res.ok) {
          throw new Error(`Failed to load bookings: ${res.statusText}`);
        }
        const raw: Booking[] = await res.json();
 
        // 2) filter confirmed
        const confirmed = raw.filter((b) => b.status === 'CONFIRMED');
 
        // 3) enrich each with room & hotel details
        const enriched = await Promise.all(
          confirmed.map(async (booking) => {
            // fetch room
            let room: Room = { hotelId: -1, type: 'N/A' };
            try {
              const r = await fetch(
                `${ROOM_API_BASE_URL}/${booking.roomId}`
              );
              if (r.ok) room = await r.json();
            } catch {
              // ignore
            }
 
            // fetch hotel
            let hotelName = 'Hotel Not Found';
            if (room.hotelId !== -1) {
              try {
                const h = await fetch(
                  `${HOTEL_API_BASE_URL}/${room.hotelId}`
                );
                if (h.ok) {
                  const hotel: Hotel = await h.json();
                  hotelName = hotel.name;
                }
              } catch {
                // ignore
              }
            }
 
            return {
              ...booking,
              hotelId: room.hotelId,
              hotelName,
              roomType: room.type,
            };
          })
        );
 
        setBookings(enriched);
      } catch (e: any) {
        console.error('Error loading bookings:', e);
        setError(e.message || 'Unable to load bookings.');
      } finally {
        setLoading(false);
      }
    };
 
    fetchBookings();
  }, [userId]);
 
  const formatDate = (iso: string) => {
    const dt = parseISO(iso);
    return isValid(dt) ? format(dt, 'MMM do, yyyy') : 'Invalid Date';
  };
 
  const handleReview = (booking: Booking) =>
    navigate('/submit-review', {
      state: {
        userId,
        hotelId: booking.hotelId,
        bookingId: booking.bookingId,
      },
    });
 
  const handleCancel = async (booking: Booking) => {
    if (!window.confirm(`Cancel booking ${booking.bookingId}?`)) return;
 
    setLoading(true);
    setError(null);
 
    try {
      // 1) Delete the booking
      const res = await fetch(
        `${BACKEND_BASE_URL}/bookings/${booking.bookingId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Cancel failed');
      }
 
      // 2) Refund amount as loyalty points
      const refundPoints = booking.payment?.amount || 0;
      if (refundPoints > 0) {
        const loyaltyRes = await fetch(
          `${LOYALTY_API_BASE_URL}/addPoints/${userId}/${refundPoints}`,
          { method: 'PUT' }
        );
        if (!loyaltyRes.ok) {
          console.warn(
            `Failed to refund points: ${loyaltyRes.statusText}`
          );
        } else {
          console.log(
            `Refunded ${refundPoints} points to user ${userId}`
          );
        }
      }
 
      // 3) Update local state
      setBookings((bs) =>
        bs.filter((b) => b.bookingId !== booking.bookingId)
      );
      alert(
        `Booking ${booking.bookingId} cancelled.\nRefunded ₹${refundPoints} as loyalty points.`
      );
    } catch (e: any) {
      console.error('Error cancelling booking:', e);
      setError(e.message || 'Error cancelling booking.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <CustomNavbar />
      <br />
      <br />
      <br />
      <Container className="py-5 bg-white text-dark min-vh-100">
        <h2
          className="text-center mb-5 display-4 fw-bold"
          style={{ color: '#000' }}
        >
          My Bookings
        </h2>
 
        {loading ? (
          <div className="text-center my-5">
            <Spinner
              animation="border"
              variant="success"
              className="mb-3"
            />
            <p className="fs-5 text-muted">
              Loading your bookings...
            </p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center my-5">
            <Alert.Heading>
              Oh snap! You got an error!
            </Alert.Heading>
            <p>{error}</p>
          </Alert>
        ) : bookings.length === 0 ? (
          <Alert variant="info" className="text-center my-5">
            <Alert.Heading>
              No Confirmed Bookings Yet!
            </Alert.Heading>
            <p>
              Explore some amazing hotels to make your first
              booking.
            </p>
            <Button
              variant="success"
              onClick={() => navigate('/manage-hotels')}
            >
              Explore Hotels
            </Button>
          </Alert>
        ) : (
          <Row
            xs={1}
            md={2}
            lg={3}
            className="g-4 justify-content-center"
          >
            {bookings.map((booking) => (
              <Col key={booking.bookingId}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Header className="bg-success text-white fw-bold py-3">
                    Booking ID: {booking.bookingId}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title className="text-center mb-3">
                      {booking.hotelName}
                    </Card.Title>
                    <ul className="list-unstyled mb-4">
                      <li className="d-flex justify-content-between">
                        <span>Room Type:</span>
                        <span>{booking.roomType}</span>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Check-in:</span>
                        <span>
                          {formatDate(booking.checkInDate)}
                        </span>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Check-out:</span>
                        <span>
                          {formatDate(booking.checkOutDate)}
                        </span>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Price Paid:</span>
                        <span>
                          {booking.payment
                            ? `₹${booking.payment.amount.toLocaleString(
                                'en-IN',
                                { minimumFractionDigits: 2 }
                              )}`
                            : 'N/A'}
                        </span>
                      </li>
                    </ul>
                  </Card.Body>
                  <Card.Footer className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="outline-success"
                      onClick={() => handleReview(booking)}
                      disabled={!booking.hotelId}
                      className="flex-grow-1"
                    >
                      Submit Review
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => handleCancel(booking)}
                      className="flex-grow-1"
                    >
                      Cancel Booking
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
};
 
export default MyBookings;
 
 