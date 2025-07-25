// components/AllReviews.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AllReviews.css';

// Define ReviewDto interface directly within this file
interface ReviewDto {
  userId: number;
  reviewId: number;
  hotelId: number;
  rating: number;
  comment: string;
  timestamp?: string;
  managerReply?: string;
}

// Define props interface for AllReviews
interface AllReviewsProps {
  hotelId: string; // Changed to string to match useSearchParams.get() output
}

const BASE_URL = "http://localhost:9999/review-api"; // ⭐ Ensure this matches your gateway config for review-api

const AllReviews: React.FC<AllReviewsProps> = ({ hotelId }) => {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [error, setError] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatDate = (timestamp?: string): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toISOString().split('T')[0];
  };

  const fetchReviews = async () => {
    // Only fetch if hotelId is available
    if (!hotelId) {
      setError('Hotel ID is missing for fetching reviews.');
      setReviews([]);
      return;
    }

    // --- Bearer Token Authentication Added ---
    const token = localStorage.getItem("token"); // Get token from local storage

    if (!token) {
      console.warn("JWT token missing - AllReviews fetch aborted.");
      setError("Authentication token missing. Please log in to view reviews.");
      setReviews([]); // Clear any previous reviews if token is missing
      return;
    }
    // --- End of Bearer Token Authentication Added ---

    try {
      // Use the prop hotelId in the API call
      const response = await axios.get(`${BASE_URL}/reviews/hotel/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the headers
        }
      });
      const data = response.data;
      console.log("Review API response:", data);

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: Expected array");
      }

      setReviews(data);
      setError('');
      setVisibleCount(4);
    } catch (err: any) {
      console.error("Error fetching reviews:", err.message || err);
      // More descriptive error message for authentication issues
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Failed to fetch reviews: Unauthorized. Please check your login.');
      } else {
        setError('Failed to fetch reviews. Please try again later.');
      }
      setReviews([]); // prevent slice/map from crashing
    }
  };

  const handleShowMore = () => {
    setVisibleCount(reviews.length);
  };

  useEffect(() => {
    fetchReviews(); // fetch on mount or when hotelId changes
  }, [hotelId]); // Add hotelId to dependency array so it re-fetches when the hotel changes

  return (
    <div className="container mt-4 all-wrapper" ref={containerRef}>
      <h3>Guest Reviews</h3>

      {error && <div className="all-error-message">{error}</div>}

      {!error && reviews.length === 0 && <p>No reviews available for this hotel.</p>}

      {Array.isArray(reviews) && reviews.length > 0 && (
        <>
          <ul className="all-review-list">
            {reviews.slice(0, visibleCount).map((review) => (
              <li key={review.reviewId} className="all-review-card d-flex align-items-start">
                <img src="src/assets/avatar.png" alt="User Avatar" className="all-avatar me-3" />
                <div className="all-review-details">
                  <strong>User ID:</strong> {review.userId} <br />
                  <strong>Rating:</strong> {review.rating} <br />
                  {review.comment} <br />
                  <small className="all-timestamp">Posted on: {formatDate(review.timestamp)}</small>
                  {review.managerReply && (
                    <p className="all-manager-reply mt-2">
                      <strong>Manager Reply:</strong> {review.managerReply}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {visibleCount < reviews.length && (
            <div className="text-center mt-3">
              <button className="btn all-cta-button" onClick={handleShowMore}>
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllReviews;