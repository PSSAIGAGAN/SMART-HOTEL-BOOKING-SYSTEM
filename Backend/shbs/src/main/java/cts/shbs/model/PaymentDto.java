package cts.shbs.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for capturing payment details and Razorpay verification data. [cite: 18, 19]
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private Long paymentId; // Optional if auto-generated or handled separately [cite: 19, 20]

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be a positive number")
    private Long userId; 

    // NEW: Include bookingId in DTO
    private Long bookingId; // To link the payment to a booking when creating an order

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private Double amount; 

    @NotNull(message = "Status is required")
    @Size(min = 1, message = "Status cannot be empty")
    private String status; 

    @NotNull(message = "Payment method is required")
    @Size(min = 1, message = "Payment method cannot be empty")
    private String paymentMethod; 

    @NotNull(message = "Currency is required")
    @Size(min = 1, message = "Currency cannot be empty")
    private String currency; 

    // Razorpay fields for verification [cite: 25]
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
}