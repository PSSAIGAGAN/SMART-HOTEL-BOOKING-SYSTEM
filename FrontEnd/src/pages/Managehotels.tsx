// pages/ManageHotels.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HotelCard from '../components/HotelCard';
import { Container, Spinner } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from '../components/Footer';

// Define the Hotel interface to include minPrice
interface Hotel {
  hotelId: number;
  name: string;
  location: string;
  amenities: string;
  rating?: number;
  url: string;
  minPrice?: number; // Add minPrice property
}

const ManageHotel = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

  // Extract checkIn and checkOut dates from the current URL
  const queryParams = new URLSearchParams(location.search);
  const searchLocation = queryParams.get('location');
  const checkIn = queryParams.get('checkIn');
  const checkOut = queryParams.get('checkOut');

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setMessage('');
      try {
        let response;
        const BASE_HOTEL_API_URL = "http://localhost:8083/api/hotels";

        if (searchLocation) {
          response = await axios.get<Hotel[]>(`${BASE_HOTEL_API_URL}/search?location=${encodeURIComponent(searchLocation)}`);
          setMessage(`Showing Properties in "${searchLocation}"`);
        } else {
          response = await axios.get<Hotel[]>('${BASE_HOTEL_API_URL}/all');
          setMessage('Showing All Properties');
        }

        if (response.data.length === 0 && searchLocation) {
            setMessage(`There is no property listed in "${searchLocation}" yet!`);
        } else if (response.data.length === 0 && !searchLocation) {
            setMessage('No properties found.');
        }
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setMessage('Failed to fetch hotels. Please try again.');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [location.search]);

  // Handler to navigate to ManageRooms with dates
  const handleHotelCardClick = (hotelId: number) => {
    // Construct the URL, ensuring checkIn and checkOut are passed
    const params = new URLSearchParams();
    params.append('hotelId', hotelId.toString());
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);

    navigate(`/manage-rooms?${params.toString()}`);
  };

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
            <p>Loading hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <p className="text-center text-muted">No hotels found matching your criteria.</p>
        ) : (
          hotels.map(hotel => (
            // ⭐ Pass the handleClick function to HotelCard
            <HotelCard key={hotel.hotelId} hotel={hotel} onClick={() => handleHotelCardClick(hotel.hotelId)} />
          ))
        )}
      </Container>
      <Footer></Footer>
    </>
  );
};

export default ManageHotel;