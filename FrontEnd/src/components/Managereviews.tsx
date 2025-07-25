import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import './Managereviews.css';
import axios from 'axios';

interface Review {
  userId: number;
  reviewId: number;
  hotelId: number;
  rating: number;
  comment: string;
}

const Managereviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("JWT token missing — review fetch aborted");
        return;
      }

      const response = await axios.get('http://localhost:9999/review-api/review', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: number) => {
    const confirmed = window.confirm(`Are you sure you want to delete review ID ${reviewId}?`);
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:9999/review-api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReviews(prev => prev.filter(r => r.reviewId !== reviewId));
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
    }
  };

  return (
    <>
      <div className="review-header-section">
        {/* You can add a heading or controls if needed */}
      </div>

      <div className="review-table-wrapper table-responsive">
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>User Id</th>
              <th>Review Id</th>
              <th>Hotel Id</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-3">Loading reviews...</td>
              </tr>
            ) : (
              reviews.map((r, idx) => (
                <tr key={idx}>
                  <td data-label="User Id">{r.userId}</td>
                  <td data-label="Review Id">{r.reviewId}</td>
                  <td data-label="Hotel Id">{r.hotelId}</td>
                  <td data-label="Rating">{r.rating}</td>
                  <td data-label="Comment">{r.comment}</td>
                  <td data-label="Action" className="review-action-icons">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteReview(r.reviewId)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default Managereviews;
