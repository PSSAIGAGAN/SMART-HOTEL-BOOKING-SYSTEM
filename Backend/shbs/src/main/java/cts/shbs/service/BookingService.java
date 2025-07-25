package cts.shbs.service;

import java.util.List;
import java.util.Map; // Import Map

import cts.shbs.model.BookingDto;

public interface BookingService {

    // New method for creating a booking and initiating a Razorpay order
    Map<String, Object> createInitialBookingAndOrder(BookingDto bookingDTO);

    BookingDto saveBooking(BookingDto bookingDTO);

    List<BookingDto> getAllBookings();

    BookingDto getBookingById(Long id);

    BookingDto updateBooking(Long id, BookingDto updatedBookingDTO);

    void deleteBooking(Long id);
    
   List<BookingDto> getBookingsByUserId(Long userId);
}