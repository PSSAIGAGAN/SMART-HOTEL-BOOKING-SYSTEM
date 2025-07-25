import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import styles from './EditUserModelStyles.module.css';
import { useNavigate } from 'react-router-dom';

interface EditUserModalProps {
  show: boolean;
  onHide: () => void;
  userData: {
    userId: number;
    name: string;
    email: string;
    contactNumber: number;
    roles: Array<{ roleName: string }>;
  };
  onUpdate: (updated: any) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ show, onHide, userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    contactNumber: String(userData.contactNumber ?? ''),
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = {
      userId: userData.userId,
      name: formData.name,
      email: formData.email,
      contactNumber: parseInt(formData.contactNumber),
      password: formData.password.trim(),
      roles: userData.roles
    };

    try {
      const res = await axios.put('http://localhost:9999/user-api/users', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate(res.data);
      onHide();
      navigate('/userdetails');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>Edit Your Information</Modal.Title>
        <span className={styles.closeIcon} onClick={onHide}>×</span>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
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
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formControl}
                required
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={styles.formControl}
                required
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>New Password (optional)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.formControl}
                placeholder="Leave blank to keep current"
              />
            </Col>
          </Row>

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

export default EditUserModal;
