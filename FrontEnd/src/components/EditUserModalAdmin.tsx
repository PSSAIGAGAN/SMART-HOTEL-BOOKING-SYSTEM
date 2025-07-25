import React, { useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import styles from './EditUserModelStyles.module.css';
import { updateUser } from './userService';

interface EditUserModalAdminProps {
  show: boolean;
  onHide: () => void;
  userData: {
    userId: number;
    name: string;
    email: string;
    contactNumber: number;
    roleName: string;
  };
  onUpdate: (updated: any) => void;
}

const EditUserModalAdmin: React.FC<EditUserModalAdminProps> = ({
  show,
  onHide,
  userData,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    contactNumber: String(userData.contactNumber ?? '')
  });

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
      const updated = await updateUser({
        userId: userData.userId,
        name: formData.name,
        email: formData.email,
        contactNumber: parseInt(formData.contactNumber),
        roles: [{ roleName: userData.roleName }] // ✅ fix: send roles to backend
      });

      onUpdate({
        ...updated,
        roles: [{ roleName: userData.roleName }]
      });

      onHide();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>Edit User</Modal.Title>
        <span className={styles.closeIcon} onClick={onHide}>×</span>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>User ID</Form.Label>
              <Form.Control
                type="text"
                value={userData.userId}
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

export default EditUserModalAdmin;
