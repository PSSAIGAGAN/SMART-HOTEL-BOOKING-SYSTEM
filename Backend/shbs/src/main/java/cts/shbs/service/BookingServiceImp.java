package cts.shbs.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cts.shbs.model.BookingDto;
import cts.shbs.model.PaymentDto;
import cts.shbs.entity.Booking;
import cts.shbs.entity.BookingStatus;
import cts.shbs.entity.Payment;
import cts.shbs.entity.PaymentStatus;
import cts.shbs.exception.ResourceNotFoundException;
import cts.shbs.repository.BookingRepository;
import cts.shbs.repository.PaymentRepository;

@Service
public class BookingServiceImp implements BookingService {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;


    @Transactional
    public Map<String, Object> createInitialBookingAndOrder(BookingDto bookingDTO) {
        // Step 1: Create and save the Booking in a PENDING_PAYMENT state
        Booking booking = modelMapper.map(bookingDTO, Booking.class);
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setPayment(null);
        Booking savedBooking = bookingRepo.save(booking);

        // Step 2: Create a PENDING Payment entity and associate it with the Booking
        Payment initialPayment = new Payment();
        initialPayment.setUserId(savedBooking.getUserId());
        initialPayment.setBookingId(savedBooking.getBookingId());
        initialPayment.setAmount(bookingDTO.getPayment().getAmount());
        initialPayment.setCurrency(bookingDTO.getPayment().getCurrency());
        initialPayment.setStatus(PaymentStatus.PENDING);
        initialPayment.setPaymentMethod("Razorpay");

        Payment savedInitialPayment = paymentRepo.save(initialPayment);

        // Step 3: Create Razorpay Order
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            int amountInPaise = (int) (savedInitialPayment.getAmount() * 100);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", savedInitialPayment.getCurrency());
            orderRequest.put("receipt", "receipt_" + savedBooking.getBookingId());
            orderRequest.put("payment_capture", 1);

            Order order = razorpayClient.orders.create(orderRequest);

            // Update the initial Payment record with the Razorpay Order ID
            savedInitialPayment.setRazorpayOrderId(order.get("id"));
            paymentRepo.save(savedInitialPayment);

            // Update the Booking entity with the created Payment entity
            savedBooking.setPayment(savedInitialPayment);
            bookingRepo.save(savedBooking);

            Map<String, Object> response = new HashMap<>();
            response.put("bookingId", savedBooking.getBookingId());
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("paymentRecordId", savedInitialPayment.getPaymentId());
            return response;

        } catch (RazorpayException e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage(), e);
        }
    }

    @Override
    public List<BookingDto> getAllBookings() {
        return bookingRepo.findAll().stream()
                .map(booking -> modelMapper.map(booking, BookingDto.class))
                .collect(Collectors.toList());
    }
    public List<BookingDto> getBookingsByUserId(Long userId) {
        List<Booking> bookings = bookingRepo.findByUserId(userId);
        return bookings.stream()
                       .map(booking-> modelMapper.map(booking, BookingDto.class))
                       .collect(Collectors.toList());
    }

    @Override
    public BookingDto getBookingById(Long id) {
        Booking booking = bookingRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        return modelMapper.map(booking, BookingDto.class);
    }

    @Override
    @Transactional
    public BookingDto updateBooking(Long id, BookingDto updatedBookingDTO) {
        Booking booking = bookingRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        booking.setRoomId(updatedBookingDTO.getRoomId());
        booking.setUserId(updatedBookingDTO.getUserId());
        booking.setCheckInDate(updatedBookingDTO.getCheckInDate());
        booking.setCheckOutDate(updatedBookingDTO.getCheckOutDate());

        Booking updatedBooking = bookingRepo.save(booking);
        return modelMapper.map(updatedBooking, BookingDto.class);
    }

    @Override
    public void deleteBooking(Long id) {
        if (!bookingRepo.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found with ID: " + id);
        }
        bookingRepo.deleteById(id);
    }

    @Override
    @Transactional
    public BookingDto saveBooking(BookingDto bookingDTO) {
        Booking booking = modelMapper.map(bookingDTO, Booking.class);
        if (booking.getStatus() == null) {
            booking.setStatus(BookingStatus.PENDING_PAYMENT);
        }
        Booking savedBooking = bookingRepo.save(booking);
        return modelMapper.map(savedBooking, BookingDto.class);
    }
}