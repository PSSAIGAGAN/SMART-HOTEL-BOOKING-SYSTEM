package cts.shbs.repository;

import cts.shbs.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> { // Primary key is Long paymentId
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId); // 
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId); // New method to find by Razorpay's actual payment ID
    Optional<Payment> findByBookingId(Long bookingId);
}
