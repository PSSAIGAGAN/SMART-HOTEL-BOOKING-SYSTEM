import React, { useState } from 'react';

import type { ReviewDto } from './ReviewDto';

import { addReview } from '../services/reviewService';

import './ReviewForm.css';

import { Filter } from 'bad-words';

import { useLocation, useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar';
import Footer from './Footer';
 
const ReviewForm: React.FC = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const { userId, hotelId, bookingId } = location.state || {};
 
  const [rating, setRating] = useState<number | null>(null);

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const [comment, setComment] = useState<string>('');

  const [ratingError, setRatingError] = useState<string>('');

  const [commentError, setCommentError] = useState<string>('');

  const [message, setMessage] = useState<string>('');
 
  const ratingStars = [1, 2, 3, 4, 5];

  const filter = new Filter();

  filter.addWords('idiot', 'stupid');
 
  const validateRating = () => {

    if (rating === null) {

      setRatingError('Rating is required');

      return false;

    }

    setRatingError('');

    return true;

  };
 
  const validateComment = () => {

    const cleanedComment = comment.replace(/\s+/g, ' ').trim();
 
    if (cleanedComment.length === 0) {

      setCommentError('Comment is required');

      return false;

    }
 
    if (filter.isProfane(cleanedComment)) {

      setCommentError('Comment contains inappropriate language. Please revise it.');

      return false;

    }
 
    const regEx = /^[A-Za-z\s]{8,}$/;

    if (!regEx.test(cleanedComment)) {

      setCommentError('Comment must be at least 8 characters and contain only letters and spaces');

      return false;

    }
 
    setCommentError('');

    return true;

  };
 
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
 
    const isRatingValid = validateRating();

    const isCommentValid = validateComment();
 
    if (!isRatingValid || !isCommentValid) return;
 
    if (!userId || !hotelId ) {

      setMessage("Missing booking info. Please return to your bookings and try again.");

      return;

    }
 
    const sanitizedComment = comment.replace(/\s+/g, ' ').trim();
 
    const newReview: ReviewDto = {

      userId,

      hotelId,


      rating: rating!,

      comment: sanitizedComment,

    };
 
    try {

      const response = await addReview(newReview);

      setMessage(`Review submitted! ID: ${response.reviewId}`);

      setComment('');

      setRating(null);

      setHoverRating(null);
 
      setTimeout(() => navigate('/my-bookings'), 2000);

    } catch (error) {

      setMessage('Error submitting review.');

    }

  };
 
  return (
    <div>
      <CustomNavbar/>
      <br />
<div className="rf-form-container">
<h1 className="rf-heading">Submit a Review</h1>
<form onSubmit={handleSubmit}>
<label className="rf-label">Your Rating</label>
<div className="rf-star-rating" onBlur={validateRating} tabIndex={0}>

          {ratingStars.map((star) => (
<span

              key={star}

              className={`rf-star ${star <= (hoverRating ?? rating ?? 0) ? 'filled' : ''}`}

              onClick={() => setRating(star)}

              onMouseEnter={() => setHoverRating(star)}

              onMouseLeave={() => setHoverRating(null)}
>

              ★
</span>

          ))}
</div>

        {ratingError && <p className="rf-error">{ratingError}</p>}
 
        <label className="rf-label">Your Comment</label>
<textarea

          className="rf-textarea"

          value={comment}

          onChange={(e) => setComment(e.target.value)}

          onBlur={validateComment}

          placeholder="Write your review here..."

          required

        />

        {commentError && <p className="rf-error">{commentError}</p>}
 
        <input type="submit" className="rf-submit-button" value="Submit Review" />
</form>

      {message && <div className="rf-message">{message}</div>}
</div>
<br />
<Footer/>
</div>

  );

};
 
export default ReviewForm;

 