// src/Routes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ManageHotel from './pages/Managehotels';
import ManageRooms from './pages/ManageRooms';
import CheckRoomButton from './pages/ManageRoomsPage';
import BookingSummary from './components/BookingSummary'; // Ensure this path is correct
import Payment from './components/Payment';
import MyBookings from './components/MyBookings';
import Loyaltypage from './pages/Loyaltypage'; // Import the Loyalty page
import ReviewForm from './components/ReviewForm';

import { jwtDecode } from 'jwt-decode';
import Registration from './components/Registration';
import Userdetails from './components/Userdetails';
import Login from './components/Login';
import Manageusers from './components/Manageusers';
import ManageRoomsPage from './pages/ManageRoomsPage';
import SearchBar from './components/SearchBar';
import ReplyToReview from './components/ReplyToReview';

  // ✅ Token expiry logic
  

  function AppRoutes () {
    const token = window.localStorage.getItem("token");
   
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const expiryTime = decoded.exp * 1000; // convert to milliseconds
      const remainingTime = expiryTime - Date.now();

      if (remainingTime <= 0) {
        window.localStorage.clear();
        window.location.href = "/login"; // Force redirect
      } else {
        setTimeout(() => {
          window.localStorage.clear();
          window.location.href = "/login";
        }, remainingTime);
      }
    } catch {
      window.localStorage.clear();
      window.location.href = "/login";
    }
  }

  const isLoggedIn = window.localStorage.getItem("loggedIn"); // Check if logged in
  const userType = window.localStorage.getItem("userType");
  return(
    <div>
    <Routes>
      {!isLoggedIn && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home />} />
          <Route path="/hotelslist" element={<ManageHotel />} />
          <Route path="/userDetails" element={<Userdetails />} />
          <Route path="/searchbar" element={<SearchBar />} />
        </>
      )}


      <Route path="/userDetails" element={<Userdetails />} />
      <Route path="/hotelslist" element={<ManageHotel />} />
      <Route path="/admin-dashboard" element={<Manageusers />} />
      <Route path="/managerooms" element={<ManageRoomsPage />} />
      <Route path="/reply-to-reviews" element={<ReplyToReview />} /> {/* Add this route */}



      <Route path="/" element={<Home />} />
      <Route path="/searchbar" element={<SearchBar />} />
      <Route path="/manage-hotels" element={<ManageHotel />} />
      <Route path="/manage-rooms" element={<ManageRooms />} />
      <Route path="/check-room" element={<CheckRoomButton />} />
      <Route path="/booking-summary" element={<BookingSummary />} /> {/* ⭐ ADD THIS ROUTE */}
      <Route path="/payment" element={<Payment />} /> {/* ⭐ ADD THIS ROUTE */}
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/loyalty" element={<Loyaltypage />} /> {/* Add Loyalty page route */}
      <Route path="/submit-review" element={<ReviewForm />} />



    </Routes>
    </div>
  );
}

  export default AppRoutes;
