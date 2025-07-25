import React, { useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import styles from './EditUserModelStyles.module.css'; // same stylesheet you provided

interface AddUserModalProps {
  show: boolean;
  onHide: () => void;
  onAdd: (newUser: any) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ show, onHide, onAdd }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('GUEST');
  const [error, setError] = useState('');

  const validate = (): string => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email';
    if (!password.trim()) return 'Password is required';
    if (!passwordRegex.test(password)) return 'Invalid password';
    if (!name.trim()) return 'Name is required';
    if (!phone.trim()) return 'Contact number is required';
    if (!phoneRegex.test(phone)) return 'Invalid contact number';

    return '';
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      const payload = {
        name,
        email,
        password,
        contactNumber: phone,
        roles: [{ roleName: role }]
      };

      const res = await axios.post('http://localhost:9999/user-api/users', payload);
      onAdd({
        ...res.data,
        roles: [{ roleName: role }]
      });

      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setRole('GUEST');
      setError('');
      onHide();
    } catch (err: any) {
      setError('Add user failed — ' + (err.response?.data?.message || 'please try again'));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>Add New User</Modal.Title>
        <span className={styles.closeIcon} onClick={onHide}>×</span>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        <Form onSubmit={handleAddUser}>
          {error && <p className="text-danger">{error}</p>}

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.formControl}
                required
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Contact Number</Form.Label>
              <Form.Control
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formControl}
                required
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formControl}
                required
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Label className={styles.formLabel}>Role</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={styles.formControl}
                required
              >
                <option value="ADMIN">ADMIN</option>
                <option value="HOTEL_MANAGER">HOTEL_MANAGER</option>
                <option value="GUEST">GUEST</option>
              </Form.Select>
            </Col>
          </Row>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onHide}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Create User
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;
