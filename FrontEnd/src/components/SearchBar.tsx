import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useDateContext } from '../context/DateContext'; // Make sure the path is correct

function SearchBar() {
  const [location, setLocation] = useState('');
  const [locationsList, setLocationsList] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [clicked, setClicked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  // Destructure setDates from the context
  const { setDates } = useDateContext();

  useEffect(() => {
    // Fetch unique sorted locations from the API
    fetch('http://localhost:8083/api/hotels/locations', {
      headers: {
        'Cache-Control': 'no-cache', // Ensure fresh data
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter out empty/null locations, remove duplicates, and sort alphabetically
        const uniqueSortedLocations = Array.from(
          new Set(data.filter((loc: string) => loc && loc.trim() !== ''))
        ).sort((a: string, b: string) => a.localeCompare(b));
        setLocationsList(uniqueSortedLocations);
      })
      .catch((err) => {
        console.error('Error fetching locations:', err);
        setLocationsList([]); // Set to empty array on error
      });
  }, []); // Empty dependency array means this runs once on mount

  function handleSearch() {
    setClicked(true); // Indicate button click for styling
    setShowAlert(false); // Hide any previous alerts

    // --- Validation Checks ---
    if (!location.trim()) {
      setAlertMessage('Please select a location to search.');
      setShowAlert(true);
      return;
    }
    if (!checkIn) {
      setAlertMessage('Please select a Check-in date.');
      setShowAlert(true);
      return;
    }
    if (!checkOut) {
      setAlertMessage('Please select a Check-out date.');
      setShowAlert(true);
      return;
    }
    if (checkOut <= checkIn) {
      setAlertMessage('Check-out date must be after Check-in date.');
      setShowAlert(true);
      return;
    }
    // --- End Validation Checks ---

    // Format dates to 'YYYY-MM-DD' for API and URL
    const formattedCheckIn = format(checkIn, 'yyyy-MM-dd');
    const formattedCheckOut = format(checkOut, 'yyyy-MM-dd');

    // **Update the DateContext with the selected dates**
    setDates(formattedCheckIn, formattedCheckOut);

    // Navigate to the hotels page with search parameters
    navigate(
      `/manage-hotels?location=${encodeURIComponent(location)}&checkIn=${formattedCheckIn}&checkOut=${formattedCheckOut}`
    );
  }

  return (
    <Container className="mt-5 p-4 bg-light rounded shadow">
      {showAlert && (
        <Alert
          variant="danger"
          onClose={() => setShowAlert(false)}
          dismissible
          className="mb-3"
        >
          {alertMessage}
        </Alert>
      )}
      <Row className="g-3 justify-content-center">
        <Col xs={12} md={3}>
          <Form.Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{
              maxHeight: '200px', // Restrict height for long lists
              overflowY: 'auto', // Enable scrolling if list exceeds maxHeight
            }}
          >
            <option value="" disabled>
              Where to?
            </option>
            {locationsList.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={3}>
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date)}
            dateFormat="dd-MM-yyyy"
            minDate={new Date()} // Prevent selecting past dates
            placeholderText="Check-In"
            className="form-control" // Apply Bootstrap form control styling
          />
        </Col>
        <Col xs={12} md={3}>
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            dateFormat="dd-MM-yyyy"
            minDate={checkIn || new Date()} // Check-out must be after check-in, or today
            placeholderText="Check-Out"
            className="form-control" // Apply Bootstrap form control styling
          />
        </Col>
        <Col xs={12} md="auto">
          <Button
            onClick={handleSearch}
            style={{
              backgroundColor: clicked ? '#000000' : '#4caf50', // Change color on click
              borderColor: clicked ? '#000000' : '#4caf50',
              color: '#ffffff',
            }}
          >
            Search
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchBar;