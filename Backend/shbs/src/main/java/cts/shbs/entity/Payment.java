package cts.shbs.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments") // It's good practice to explicitly define table name [cite: 5]
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id") // Ensure this matches the referencedColumnName in Booking
    private Long paymentId; // Your internal primary key for the Payment entity [cite: 5]

    @Column(name = "user_id") // Explicit column name for clarity 
    private Long userId;

    // NEW: Link back to the Booking entity
    @Column(name = "booking_id")
    private Long bookingId; // This field will store the ID of the associated Booking

    @Column(name = "amount")
    private Double amount;

    // Change status to an Enum for better type safety
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(name = "razorpay_order_id", unique = true) // Ensures uniqueness of Razorpay Order ID [cite: 8]
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id") // Not unique, as a single order can have multiple payment attempts/IDs 
    private String razorpayPaymentId;

    @Column(name = "currency")
    private String currency; 

    @Column(name = "payment_method")
    private String paymentMethod; 
}