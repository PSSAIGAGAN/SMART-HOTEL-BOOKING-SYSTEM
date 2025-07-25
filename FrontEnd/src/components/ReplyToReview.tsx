import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import './ReplyToReview.css';

// Define the ReviewDto interface directly or import if it's in a shared types file
interface ReviewDto {
  userId: number;
  reviewId: number;
  hotelId: number;
  rating: number;
  comment: string;
  timestamp?: string;
  managerReply?: string; // Add managerReply property
}

const ReplyToReview: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [replies, setReplies] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const BASE_URL = 'http://localhost:9999/review-api'; // Define BASE_URL here

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("JWT token missing - review fetch aborted");
        setError("Authentication token missing. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/review`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReviews(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (reviewId: number, value: string) => {
    setReplies((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleReplySubmit = async (reviewId: number) => {
    const reply = replies[reviewId];
    if (!reply.trim()) {
      setError('Reply cannot be empty.');
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("JWT token missing - reply submission aborted");
      setError("Authentication token missing. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/reviews/${reviewId}/reply`,
        reply, // Send reply directly as plain text
        {
          headers: {
            'Content-Type': 'text/plain',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedReview = response.data;
      setReviews((prev) =>
        prev.map((r) => (r.reviewId === reviewId ? updatedReview : r))
      );
      setSuccess(`Reply added to review ID: ${reviewId}`);
      setReplies((prev) => ({ ...prev, [reviewId]: '' }));
      setError('');
    } catch (err: any) {
      console.error(`Error replying to review ${reviewId}:`, err);
      setError(err.response?.data?.message || `Failed to reply to review ID: ${reviewId}`);
      setSuccess('');
    }
  };

  const formatDate = (timestamp?: string): string =>
    timestamp ? new Date(timestamp).toISOString().split('T')[0] : 'N/A';

  return (
    <div className="reply-wrapper">
      <h4 className="reply-title">Manager Reply to Reviews</h4>

      {error && <div className="reply-error-message">{error}</div>}
      {success && <div className="reply-success-message">{success}</div>}

      {loading ? (
        <div className="text-center py-3">Loading reviews...</div>
      ) : (
        <ul className="reply-list">
          {reviews.length === 0 ? (
            <li className="text-center py-3">No reviews to display.</li>
          ) : (
            reviews.map((review) =>
              review.reviewId !== undefined && (
                <li key={review.reviewId} className="reply-card">
                  <div className="reply-review-details">
                    <p><strong>User ID:</strong> {review.userId}</p>
                    <p><strong>Hotel ID:</strong> {review.hotelId}</p>
                    <p><strong>Rating:</strong> {review.rating}</p>
                    <p><strong>Comment:</strong> {review.comment}</p>
                    <p><small className="reply-timestamp">Posted on: {formatDate(review.timestamp)}</small></p>
                  </div>

                  {review.managerReply ? (
                    <p className="reply-manager-reply">
                      <strong>Manager Reply:</strong> {review.managerReply}
                    </p>
                  ) : (
                    <div className="reply-input-group">
                      <input
                        type="text"
                        className="reply-input-field"
                        placeholder="Write a reply..."
                        value={replies[review.reviewId] || ''}
                        onChange={(e) =>
                          handleReplyChange(review.reviewId!, e.target.value)
                        }
                      />
                      <button
                        className="reply-button"
                        onClick={() => handleReplySubmit(review.reviewId!)}
                      >
                        Submit Reply
                      </button>
                    </div>
                  )}
                </li>
              )
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default ReplyToReview;