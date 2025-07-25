// pages/ManageRooms.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RoomCard from '../components/RoomCard';
import { Container, Spinner } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';
import { useLocation, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import '../components/AllReviews';
import AllReviews from '../components/AllReviews';

// Define the Room interface as expected from the backend
interface Room {
  roomId: number;
  hotelId: number;
  type: string;
  price: number;
  availability: boolean;
  features: string;
  url: string;
}

// Define the Hotel interface to fetch hotel name
interface Hotel {
  hotelId: number;
  name: string;
}

const ROOM_BASE_URL = 'http://localhost:8082/api/rooms';
const HOTEL_BASE_URL = 'http://localhost:8083/api/hotels';

const ManageRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [hotelName, setHotelName] = useState('Hotel Rooms');
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const hotelId = searchParams.get('hotelId');
  const checkInDate = searchParams.get('checkIn'); // Get checkInDate from URL
  const checkOutDate = searchParams.get('checkOut'); // Get checkOutDate from URL


  useEffect(() => {
    const fetchRoomsAndHotelName = async () => {
      setLoading(true);
      setMessage('');
      try {
        if (!hotelId) {
          setMessage('No hotel ID provided.');
          setLoading(false);
          return;
        }

        const hotelResponse = await axios.get<Hotel>(`${HOTEL_BASE_URL}/${hotelId}`);
        setHotelName(hotelResponse.data.name);

        const roomsResponse = await axios.get<Room[]>(`${ROOM_BASE_URL}/hotel/${hotelId}`);

        if (roomsResponse.data.length === 0) {
          setMessage(`No rooms found for ${hotelResponse.data.name} yet!`);
        } else {
          setMessage(`Rooms for ${hotelResponse.data.name}`);
        }

        const roomsWithHotelName = roomsResponse.data.map(room => ({
          ...room,
          hotelName: hotelResponse.data.name,
        }));
        setRooms(roomsWithHotelName);

      } catch (error) {
        console.error('Error fetching rooms or hotel details:', error);
        setMessage('Failed to fetch room details. Please try again. Ensure Room Microservice and Hotel Microservice are running.');
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsAndHotelName();
  }, [hotelId]);

  return (
    <>
      <CustomNavbar />
      <br /><br />
      <br />
      <Container className="mt-4">
        <h2 className="mb-4 text-center">{message}</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <p className="text-center text-muted">No rooms found for this hotel.</p>
        ) : (
          rooms.map(room => (
            <RoomCard
              key={room.roomId}
              room={room}
              checkInDate={checkInDate} // Pass checkInDate to RoomCard
              checkOutDate={checkOutDate} // Pass checkOutDate to RoomCard
            />
          ))
        )}
      </Container>
        <AllReviews hotelId={hotelId || ''} />
      <Footer></Footer>
    </>
  );
};

export default ManageRooms;