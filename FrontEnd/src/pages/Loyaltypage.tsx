import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Loyaltypage.css';
import CustomNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface RedemptionItem {
  points: number;
  discount: number;
  date: string;
}

const Loyaltypage: React.FC = () => {
  const navigate = useNavigate(); // ✅ Moved inside the component
  const [points, setPoints] = useState<number>(0);
  const [history, setHistory] = useState<RedemptionItem[]>([]);
  const userId = localStorage.getItem("userId");
  console.log(userId);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const payload: any = jwtDecode(token);
    const userId = payload.userId;

    axios
      .get(`http://localhost:9099/loyalty-api/getpoints/${userId}`)
      .then(res => setPoints(res.data))
      .catch(err => console.error('Points fetch error:', err));

    axios
      .get(`http://localhost:9099/redemption-api/history/${userId}`)
      .then(res => {
        const formatted = res.data.map((item: any) => ({
          points: item.pointsUsed,
          discount: item.discountAmount,
          date: new Date(item.timestamp).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        }));
        setHistory(formatted);
      })
      .catch(err => console.error('History fetch error:', err));
  }, [navigate]);

  return (
    <>
      <CustomNavbar />

      <div className="loyalty-page">
        <Container className="loyalty-container">
          <h2 className="page-title">Loyalty Summary</h2>

          <Card className="points-card">
            <Card.Body>
              <div className="points-value">{points}</div>
              <div className="points-label">Total Points</div>
            </Card.Body>
          </Card>

          <h4 className="section-title">Recent Redemptions</h4>
          <ListGroup className="redemption-list">
            {history.map((item, idx) => (
              <ListGroup.Item key={idx} className="redemption-item">
                <div className="redeem-details">
                  <span className="redeem-points">{item.points} pts</span>
                  <span className="redeem-discount">₹{item.discount} off</span>
                </div>
                <div className="redeem-date">{item.date}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <p className="loyalty-note mt-4">
            <strong>Note:</strong> 1 Loyalty point is equivalent to ₹1. It can't be withdrawn in the form of cash or transferred to any bank account. Check FAQs for more details.
          </p>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default Loyaltypage;
