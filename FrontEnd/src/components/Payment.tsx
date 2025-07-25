// Payment.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ⭐ Import React-Bootstrap components
import { Container, Card, Button, Alert, Modal, Spinner, Row, Col } from 'react-bootstrap';

// Define the Razorpay global object type
declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

// Define types (assuming these are in a types.ts file or similar)
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

type MessageType = 'success' | 'error' | 'info' | '';

const RAZORPAY_KEY_ID = 'rzp_test_GnJorbqSzyuiCm'; // Replace with your actual Razorpay Key ID
const BACKEND_BASE_URL = 'http://localhost:9095/api';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    amount,
    bookingId,
    orderId,
    currency,
    userId
  } = (location.state || {}) as {
    amount?: number;
    bookingId?: string;
    orderId?: string;
    currency?: string;
    userId: number;
  };

  // Convert amount from paise (Razorpay) to Rupees for display
  const finalAmountInPaise = amount || 0;
  const finalAmountDisplay = (finalAmountInPaise / 100).toFixed(2);

  const currentBookingId = bookingId || '';
  const razorpayOrderId = orderId || '';
  const razorpayCurrency = currency || '';
  const currentUserId = userId ?? 0;

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Renamed for clarity with Modal component
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // New state for button loading

  useEffect(() => {
    if (!currentBookingId || !razorpayOrderId || !razorpayCurrency || finalAmountInPaise <= 0) {
      displayMessage('Booking or payment order information is missing. Please go back and create a booking.', 'danger'); // Changed 'error' to 'danger' for Alert variant
    } else {
      displayMessage('Ready to process payment. Click "Pay securely with Razorpay".', 'info');
    }
  }, [razorpayOrderId, finalAmountInPaise, razorpayCurrency, currentBookingId]);

  const displayMessage = (text: string, type: MessageType) => {
    setMessage(text);
    setMessageType(type);
  };

  const handlePayWithRazorpay = () => {
    if (!currentBookingId || !razorpayOrderId || finalAmountInPaise <= 0 || !razorpayCurrency) {
      displayMessage('Booking or payment order information is incomplete. Cannot proceed.', 'danger');
      return;
    }

    displayMessage('Opening payment gateway...', 'info');
    setIsProcessingPayment(true); // Disable button and show loading

    openRazorpayCheckout({
      id: razorpayOrderId,
      amount: finalAmountInPaise,
      currency: razorpayCurrency
    });
  };

  const handleGoToHome = () => {
    setShowConfirmationModal(false);
    setMessage('');
    setMessageType('');
    navigate('/');
  };

  const openRazorpayCheckout = (order: { id: string; amount: number; currency: string }) => {
    if (typeof window.Razorpay !== 'function') {
      displayMessage('Razorpay script not loaded. Please refresh the page.', 'danger');
      setIsProcessingPayment(false); // Re-enable button
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount, // amount in paise
      currency: order.currency,
      name: 'hopNstay',
      description: 'Room Booking Payment',
      order_id: order.id,
      handler: async (response: RazorpayResponse) => {
        console.log('🔍 Razorpay Response:', response);

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

        if (!razorpay_signature) {
          console.error('❌ razorpay_signature missing in response');
          displayMessage('Payment verification failed: Signature missing.', 'danger');
          setIsProcessingPayment(false); // Re-enable button
          return;
        }

        displayMessage('Verifying payment...', 'info');

        try {
          const verifyResponse = await fetch(`${BACKEND_BASE_URL}/payments/verifyPayment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
          });

          if (!verifyResponse.ok) {
            const errorText = await verifyResponse.text();
            throw new Error(errorText || 'Payment verification failed.');
          }

          // Dynamically import axios for loyalty points if needed
          const axiosInstance = (await import('axios')).default;
          // Calculate loyalty points based on amount in Rupees (finalAmountDisplay is a string)
          const loyaltyPointsToAdd = Math.round((finalAmountInPaise / 100) * 0.05); // Calculate from paise then convert to rupees for calculation

          const loyaltyResponse = await axiosInstance.put(
            `http://localhost:9099/loyalty-api/addPoints/${currentUserId}/${loyaltyPointsToAdd}`
          );
          console.log('🏆 Loyalty Points Added:', loyaltyResponse.data);

          setShowConfirmationModal(true);
          displayMessage('Payment verified and booking confirmed successfully! 🎉', 'success');

        } catch (error: any) {
          console.error('Error during payment verification:', error);
          displayMessage(`Error: ${error.message}`, 'danger');
        } finally {
          setIsProcessingPayment(false); // Always re-enable button
        }
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      notes: {
        booking_amount: finalAmountInPaise / 100 // Amount in Rupees for notes
      },
      theme: {
        color: '#4CAF50' // Primary green color
      },
      method: {
        upi: true,
        netbanking: true,
        wallet: true,
        card: false,
        paylater: false
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      console.error('Payment Failed:', response.error);
      displayMessage(`Payment failed: ${response.error.description || response.error.reason || 'Unknown error'}`, 'danger');
      setIsProcessingPayment(false); // Re-enable button
    });

    rzp.open();
  };

  const isPayButtonDisabled = isProcessingPayment || !currentBookingId || !razorpayOrderId || finalAmountInPaise <= 0 || !razorpayCurrency;

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center py-5 min-vh-100 bg-light">
      <Card className="p-4 shadow-lg text-center" style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Header className="bg-white border-0 pb-0">
          <svg className="mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50" width="60px" height="60px">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <Card.Title as="h1" className="fw-bold fs-3 text-dark">Secure Payment</Card.Title>
        </Card.Header>
        <Card.Body>
          <p className="fs-5 mb-2"><strong>Total Amount to Pay:</strong> ₹{finalAmountDisplay}</p>
          <p className="text-muted mb-4">Click the button below to proceed to our secure payment gateway (powered by Razorpay).</p>

          <Button
            variant="success"
            className="w-100 py-2 fs-5"
            onClick={handlePayWithRazorpay}
            disabled={isPayButtonDisabled}
          >
            {isProcessingPayment ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Processing...
              </>
            ) : (
              'Pay securely with Razorpay'
            )}
          </Button>

          {message && (
            <Alert variant={messageType === 'success' ? 'success' : messageType === 'error' ? 'danger' : 'info'} className="mt-4">
              {message}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showConfirmationModal} onHide={handleGoToHome} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          {/* Close button is handled by closeButton prop */}
        </Modal.Header>
        <Modal.Body className="text-center pt-0">
          <div className="d-flex justify-content-center mb-3">
            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '90px', height: '90px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="60px" height="60px">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>
          <Modal.Title as="h2" className="fw-bold mb-3 fs-3 text-dark">🎉 Booking Confirmed!</Modal.Title>
          <p className="mb-4 text-secondary">
            Thank you for choosing <strong>hopNstay</strong>.<br />
            Your booking is all set and you're ready to go! 🚀
          </p>

          <Card className="border-0 bg-light p-3 mb-4">
            <Card.Body className="p-0">
              <p className="mb-2 fs-5 text-dark">
                🏆 You’ve earned <strong>{Math.round((finalAmountInPaise / 100) * 0.05)} loyalty points</strong> for this booking.
              </p>
              <p className="mb-0 text-muted small">
                Points have been securely added to your account to use on future stays!
              </p>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0 pt-0">
          <Button variant="success" onClick={handleGoToHome} className="px-5 py-2">
            Go to Home
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Payment;