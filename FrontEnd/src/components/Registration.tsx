import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registration.css';
import Successmodel from './Successmodel';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  //  Validate user input
  const isFormValid = (): { valid: boolean; message: string } => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(email)) return { valid: false, message: 'Invalid email format' };
    if (!passwordRegex.test(password)) return {
      valid: false,
      message: 'Password must be at least 8 characters and include uppercase, lowercase, and a digit'
    };
    if (name.trim().length === 0) return { valid: false, message: 'Name is required' };
    if (!phoneRegex.test(phone)) return {
      valid: false,
      message: 'Contact number must be 10 digits starting with 6-9'
    };

    return { valid: true, message: '' };
  };

  //  Registration + loyalty creation
  const registerUser = async () => {
    try {
      const payload = {
        name,
        email,
        password,
        contactNumber: phone,
        roles: [{ roleName: 'GUEST' }]
      };

      const userResponse = await axios.post('http://localhost:9999/user-api/users', payload);
      const userId = userResponse.data.userId;

      //  Loyalty creation without token
      try {
        await axios.post(`http://localhost:9099/loyalty-api/create/${userId}`);
      } catch (loyaltyErr) {
        console.warn('Loyalty account creation failed:', loyaltyErr);
      }

      setShowSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Registration failed — ' + (err.response?.data?.message || 'please try again'));
    }
  };

  const register = async (event: React.FormEvent) => {
    event.preventDefault();
    const { valid, message } = isFormValid();

    if (!valid) {
      setError(message);
      return;
    }

    setError('');
    await registerUser();
  };

  return (
    <div id="register-page">
      <div id="registrationform">
        <h1>Sign up</h1>
        <form onSubmit={register}>
          {error && <p className="text-danger">{error}</p>}

          <input
            type="text"
            name="name"
            id="nameinput"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br /><br />

          <input
            type="tel"
            name="phone"
            id="phoneinput"
            maxLength={10}
            placeholder="Enter your contact number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <br /><br />

          <input
            type="email"
            name="email"
            id="emailinput"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />

          <input
            type="password"
            name="password"
            id="passwordinput"
            placeholder="Create your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input type="submit" id="submitButton" value="Sign up" />
        </form>
      </div>

      {showSuccess && (
        <Successmodel
          onClose={() => {
            setShowSuccess(false);
            navigate('/login');
          }}
        />
      )}
    </div>
  );
};

export default Registration;
