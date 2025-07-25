import axios from 'axios';
import  type { ReviewDto }  from '../components/ReviewDto';
 
 const BASE_URL = 'http://localhost:9999/review-api';

 const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token || !token.includes('.')) {
    throw new Error('Invalid or missing JWT token');
  }
  return {
    Authorization: `Bearer ${token}`
  };
};
 
export const addReview = async (review: ReviewDto) => {
  const response = await axios.post(`${BASE_URL}/reviews`, review, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
 
// export const getReviewById = async (reviewId: number) => {
//   const response = await axios.get(`${BASE_URL}/${reviewId}`,{headers: getAuthHeaders()});
//   return response.data;
// };
 
// export const getReviewsByUserId = async (userId: number) => {
//   const response = await axios.get(`${BASE_URL}/user/${userId}`,{headers: getAuthHeaders()});
//   return response.data;
// };
 
 
// export const updateReview = async (review: ReviewDto) => {
//   const response = await axios.put(`${BASE_URL}/${review.reviewId}`, review,{headers: getAuthHeaders()});
//   return response.data;
// };
 
// export const getAllReviews = async () => {
//   const hotelId = 101;
//   const response = await axios.get(`http://localhost:9999/review-api/reviews/hotel/${hotelId}`);
//   console.log("API response:", response.data); // Add this line
//   return response.data;
// };
 
 
 
export const replyToReview = async (reviewId: number, reply: string) => {
  const response = await axios.put(
    `${BASE_URL}/reviews/${reviewId}/reply`,
    reply,
    {
      headers: {
        'Content-Type': 'text/plain',
        ...getAuthHeaders(),
      },
    }
  );
  return response.data;
};
 
 
export const getAllReview = async () => {
  const response = await axios.get(BASE_URL,{headers: getAuthHeaders()});
  return response.data;
};
 
 
 
