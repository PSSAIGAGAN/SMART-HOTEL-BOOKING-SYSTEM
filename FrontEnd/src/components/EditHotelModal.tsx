import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import styles from './EditUserModelStyles.module.css';
import axios from 'axios';

interface EditHotelModalProps {
  show: boolean;
  onHide: () => void;
  hotelData: {
    hotelId: number;
    name: string;
    location: string;
    amenities: string;
    minPrice?: number | null; // Kept as optional as it's still in the source data, but won't be edited
    url: string | null; // Make sure to pass along for update if backend expects full DTO
    managerId: number | null; // Make sure to pass along for update if backend expects full DTO
  };
  onUpdate: (updatedHotel: any) => void;
}

const EditHotelModal: React.FC<EditHotelModalProps> = ({
  show,
  onHide,
  hotelData,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: hotelData.name,
    location: hotelData.location,
    amenities: hotelData.amenities,
    // ⭐ minPrice removed from formData
  });

  useEffect(() => {
    setFormData({
      name: hotelData.name,
      location: hotelData.location,
      amenities: hotelData.amenities,
      // ⭐ minPrice removed from formData update
    });
  }, [hotelData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedHotelData = {
        hotelId: hotelData.hotelId,
        name: formData.name,
        location: formData.location,
        amenities: formData.amenities,
        // ⭐ minPrice is explicitly NOT sent. Your backend's update endpoint
        // should handle this gracefully by preserving the existing price.
        // It's good practice to send back all fields the backend expects for the DTO
        // even if not edited, to avoid nulling them out, *unless* your backend
        // specifically handles partial updates (e.g., PATCH verb or intelligent PUT).
        // Based on previous discussions, your backend uses ModelMapper, which should
        // preserve unmapped fields.
        url: hotelData.url, // Pass original url
        managerId: hotelData.managerId, // Pass original managerId
      };

      const response = await axios.put(
        `http://localhost:8083/api/hotels/update/${hotelData.hotelId}`,
        updatedHotelData
      );

      alert('Hotel updated successfully!');
      onUpdate(response.data); // Pass the updated data back (optional, can just trigger re-fetch)
      onHide();
    } catch (error: any) {
      console.error('Error updating hotel:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Failed to update hotel: ${error.response.data.message || error.message}`);
      } else {
        alert('Failed to update hotel. Check console for details.');
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>Edit Hotel</Modal.Title>
        <span className={styles.closeIcon} onClick={onHide}>×</span>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Hotel ID</Form.Label>
              <Form.Control
                type="text"
                value={hotelData.hotelId}
                readOnly
                className={styles.formControl}
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.formControl}
                required
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={styles.formControl}
                required
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Amenities</Form.Label>
              <Form.Control
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className={styles.formControl}
                placeholder="e.g., Pool, WiFi, Gym (comma separated)"
              />
            </Col>
          </Row>

          {/* ⭐ Price input field removed entirely */}

          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onHide}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditHotelModal;