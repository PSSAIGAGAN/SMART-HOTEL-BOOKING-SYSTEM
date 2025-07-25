// // ManagerAddRoom.tsx
// import React, { useState } from 'react';
// import { Modal, Button, Form, Row, Col } from 'react-bootstrap'; // Added Row, Col for better layout
// import axios from 'axios';

// // Define the Room interface directly in this file if not globally defined
// interface Room {
//   hotelId: number;
//   type: string;
//   price: number;
//   availability: boolean;
//   features: string;
//   imageFile?: File; // For local file handling before upload
// }

// interface Props {
//   show: boolean;
//   onHide: () => void;
//   // Optional: A callback to notify the parent when a room is successfully added
//   onRoomAdded?: () => void;
// }

// const ManagerAddRoom: React.FC<Props> = ({ show, onHide, onRoomAdded }) => {
//   const [newRoom, setNewRoom] = useState<Room>({
//     hotelId: 0,
//     type: '',
//     price: 0,
//     availability: true,
//     features: '',
//   });

//   // Handle changes for all form fields
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;
//     setNewRoom(prevRoom => ({
//       ...prevRoom,
//       [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
//     }));
//   };

//   // Handle image file selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setNewRoom(prevRoom => ({ ...prevRoom, imageFile: e.target.files![0] }));
//     } else {
//       setNewRoom(prevRoom => {
//         const { imageFile, ...rest } = prevRoom; // Remove imageFile if no file selected
//         return rest;
//       });
//     }
//   };

//   // Handles saving the new room
//   const handleSaveRoom = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('hotelId', newRoom.hotelId.toString());
//       formData.append('type', newRoom.type);
//       formData.append('price', newRoom.price.toString());
//       formData.append('availability', newRoom.availability.toString());
//       formData.append('features', newRoom.features);

//       if (newRoom.imageFile) {
//         formData.append('image', newRoom.imageFile); // 'image' should match your backend's expected field name for the file
//       }

//       // Send a POST request with FormData
//       await axios.post('http://localhost:8082/api/rooms/create', formData);

//       alert('Room added successfully!');
//       // Reset form fields after successful submission
//       setNewRoom({
//         hotelId: 0,
//         type: '',
//         price: 0,
//         availability: true,
//         features: '',
//       });
//       onHide(); // Close the modal
//       if (onRoomAdded) {
//         onRoomAdded(); // Notify parent component (e.g., to refresh a room list)
//       }
//     } catch (error) {
//       console.error('Error saving room:', error);
//       alert('Failed to save room. Check console for details.');
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} size="lg" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Add New Room</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           <Row className="mb-3">
//             <Form.Group as={Col} controlId="formHotelId">
//               <Form.Label>Hotel ID</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="hotelId"
//                 value={newRoom.hotelId}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//             <Form.Group as={Col} controlId="formRoomType">
//               <Form.Label>Room Type</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="type"
//                 value={newRoom.type}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Row>

//           <Row className="mb-3">
//             <Form.Group as={Col} controlId="formPrice">
//               <Form.Label>Price</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="price"
//                 value={newRoom.price}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//             <Form.Group as={Col} controlId="formAvailability" className="d-flex align-items-end">
//               <Form.Check
//                 type="checkbox"
//                 name="availability"
//                 label="Available"
//                 checked={newRoom.availability}
//                 onChange={handleChange}
//                 className="mb-2" // Add some margin if needed
//               />
//             </Form.Group>
//           </Row>

//           <Form.Group className="mb-3" controlId="formFeatures">
//             <Form.Label>Features (e.g., WiFi, AC, TV)</Form.Label>
//             <Form.Control
//               type="text"
//               name="features"
//               value={newRoom.features}
//               onChange={handleChange}
//               placeholder="Separate features with commas"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="formRoomImage">
//             <Form.Label>Room Image</Form.Label>
//             <Form.Control
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//           </Form.Group>
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Close
//         </Button>
//         <Button variant="success" onClick={handleSaveRoom}>
//           Add Room
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ManagerAddRoom;