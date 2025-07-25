// AddRoomForm.tsx
import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

interface RoomData {
  roomId?: number; // <<-- CHANGED to roomId, optional for creation
  hotelId: number;
  type: string;
  price: number;
  availability: boolean;
  features: string;
  imageFile?: File;
}

interface AddRoomFormProps {
  onRoomAdded: () => void;
}

const AddRoomForm: React.FC<AddRoomFormProps> = ({ onRoomAdded }) => {
  const [newRoom, setNewRoom] = useState<RoomData>({
    hotelId: 0,
    type: '',
    price: 0,
    availability: true,
    features: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewRoom(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewRoom(prev => ({ ...prev, imageFile: e.target.files![0] }));
    } else {
      setNewRoom(prev => {
        const { imageFile, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleAddNewRoom = async () => {
    setLoading(true);
    try {
      let imageUrl = '';
      if (newRoom.imageFile) {
        const formData = new FormData();
        formData.append('image', newRoom.imageFile);

        const uploadRes = await axios.post('http://localhost:8082/api/rooms/upload', formData);
        imageUrl = uploadRes.data.url;
      }

      const roomData = {
        // roomId is intentionally omitted here for new creation, as backend auto-generates
        hotelId: newRoom.hotelId,
        type: newRoom.type,
        price: newRoom.price,
        availability: newRoom.availability,
        features: newRoom.features,
        url: imageUrl,
      };

      await axios.post('http://localhost:8082/api/rooms/create', roomData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      alert('Room added successfully!');
      setNewRoom({
        hotelId: 0,
        type: '',
        price: 0,
        availability: true,
        features: '',
      });
      onRoomAdded();
    } catch (error) {
      console.error('Error adding room:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Failed to add room. Status: ${error.response.status}. Message: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Failed to add room. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h5 className="mt-4">Add New Room</h5>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="newRoomHotelId">
            <Form.Label>Hotel ID</Form.Label>
            <Form.Control
              type="number"
              name="hotelId"
              value={newRoom.hotelId}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="newRoomType">
            <Form.Label>Room Type</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={newRoom.type}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="newRoomPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={newRoom.price}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="newRoomAvailability">
            <Form.Label>Availability</Form.Label>
            <Form.Check
              type="checkbox"
              name="availability"
              label="Available"
              checked={newRoom.availability}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3" controlId="newRoomFeatures">
          <Form.Label>Features (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            name="features"
            value={newRoom.features}
            onChange={handleChange}
            placeholder="Separate features with commas"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="newRoomImage">
          <Form.Label>Room Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant="dark" onClick={handleAddNewRoom} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Add New Room'}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AddRoomForm;