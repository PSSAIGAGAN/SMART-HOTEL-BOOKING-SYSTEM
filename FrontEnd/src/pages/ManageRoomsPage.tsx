// ManageRoomsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Spinner
} from 'react-bootstrap';
import axios from 'axios';
import AddRoomForm from '../components/AddRoomForm';
import CustomNavbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface Room {
  roomId?: number;
  hotelId: number;
  type: string;
  price: number;
  availability: boolean;
  features: string;
  url?: string;
  imageFile?: File;
}

const ManageRoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showManageRoomsModal, setShowManageRoomsModal] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [refreshTrigger]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Room[]>('http://localhost:8082/api/rooms/all');
      console.log("Fetched rooms data from backend:", response.data);
      setRooms(response.data.map(room => ({
        ...room,
        features: room.features || '',
      })));
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('Failed to fetch rooms.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomListRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'black',
    borderColor: 'black',
    width: '100%',
    color: 'white',
  };

  const handleDeleteRoom = async (roomIdToDelete: number | undefined) => {
    if (!roomIdToDelete) {
      alert('Room ID is missing for deletion.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this room?')) {
        return;
    }
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8082/api/rooms/delete/${roomIdToDelete}`);
      alert('Room deleted successfully!');
      handleRoomListRefresh();
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoom = async (roomToUpdate: Room) => {
    console.log('Attempting to update room:', roomToUpdate);

    if (roomToUpdate.roomId === undefined || roomToUpdate.roomId === null) {
      console.error('Room ID is missing for update:', roomToUpdate);
      alert('Failed to update room: Room ID is missing. Please refresh the page, and ensure rooms have IDs after fetching.');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = roomToUpdate.url || '';

      if (roomToUpdate.imageFile) {
        console.log('New image file selected for update:', roomToUpdate.imageFile.name);
        const formData = new FormData();
        formData.append('image', roomToUpdate.imageFile);

        const uploadRes = await axios.post('http://localhost:8082/api/rooms/upload', formData);
        finalImageUrl = uploadRes.data.url;
        console.log('Image uploaded, new URL:', finalImageUrl);
      } else {
        console.log('No new image selected for update. Using existing URL:', finalImageUrl);
      }

      const roomDataForUpdate = {
        roomId: roomToUpdate.roomId,
        hotelId: roomToUpdate.hotelId,
        type: roomToUpdate.type,
        price: roomToUpdate.price,
        availability: roomToUpdate.availability,
        features: roomToUpdate.features,
        url: finalImageUrl,
      };

      console.log('Sending room data for update (JSON):', roomDataForUpdate);

      await axios.put(`http://localhost:8082/api/rooms/update/${roomToUpdate.roomId}`, roomDataForUpdate, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      alert('Room updated successfully!');
      handleRoomListRefresh();
    } catch (error) {
      console.error('Error updating room:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        alert(`Failed to update room. Status: ${error.response.status}. Message: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Failed to update room. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoomFieldChange = <K extends keyof Room>(index: number, field: K, value: Room[K]) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const handleImageUploadForExistingRoom = (index: number, file: File | null) => {
    const updatedRooms = [...rooms];
    if (file) {
      updatedRooms[index].imageFile = file;
      updatedRooms[index].url = URL.createObjectURL(file);
    } else {
      delete updatedRooms[index].imageFile;
    }
    setRooms(updatedRooms);
  };

  const handleManageReviewsClick = () => {
    navigate('/reply-to-reviews');
  };

  return (
    <>
      <CustomNavbar />
      <br /><br /><br />
      <Container className="mt-4">
        <h2 className="mb-4 text-center">Hello, Manager</h2>

        <Row xs={1} sm={2} md={2} className="g-4">
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Manage Rooms</Card.Title>
                <Card.Text>View, edit, and add room details.</Card.Text>
                <Button
                  style={buttonStyle}
                  onClick={() => setShowManageRoomsModal(true)}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Manage Rooms'}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Manage Reviews</Card.Title>
                <Card.Text>Moderate and respond to customer reviews.</Card.Text>
                <Button
                  style={buttonStyle}
                  onClick={handleManageReviewsClick}
                  disabled={loading}
                >
                  Manage Reviews
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showManageRoomsModal} onHide={() => setShowManageRoomsModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Manage Rooms</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
                <p className="text-center">No rooms found. Please add a new room.</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Room ID</th>
                    <th>Hotel ID</th>
                    <th>Room Type</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Features</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, index) => (
                    <tr key={room.roomId || `temp-${index}`}>
                      <td>{room.roomId || 'N/A'}</td>
                      <td>
                        <Form.Control
                          type="number"
                          value={room.hotelId}
                          onChange={(e) => handleRoomFieldChange(index, 'hotelId', Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={room.type}
                          onChange={(e) => handleRoomFieldChange(index, 'type', e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={room.price}
                          onChange={(e) => handleRoomFieldChange(index, 'price', Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          label={room.availability ? 'Available' : 'Not Available'}
                          checked={room.availability}
                          onChange={(e) => handleRoomFieldChange(index, 'availability', e.target.checked)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={room.features}
                          onChange={(e) => handleRoomFieldChange(index, 'features', e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Group controlId={`roomImage-${room.roomId || index}`}>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageUploadForExistingRoom(index, e.target.files?.[0] || null)
                            }
                          />
                          {room.url && (
                            <img
                              src={room.url.startsWith('blob:')
                                ? room.url
                                : `http://localhost:8082/uploads/${room.url.substring(room.url.lastIndexOf('/') + 1)}`
                              }
                              alt="Room"
                              style={{ width: '80px', marginTop: '8px', objectFit: 'cover' }}
                            />
                          )}
                        </Form.Group>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleUpdateRoom(room)}
                          disabled={loading}
                        >
                          {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteRoom(room.roomId)}
                          disabled={loading}
                        >
                          {loading ? <Spinner animation="border" size="sm" /> : 'Delete'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <AddRoomForm onRoomAdded={handleRoomListRefresh} />

          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default ManageRoomsPage;