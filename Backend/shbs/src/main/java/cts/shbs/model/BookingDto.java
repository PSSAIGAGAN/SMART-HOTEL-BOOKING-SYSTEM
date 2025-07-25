package cts.shbs.model;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {

    private Long bookingId; // Optional if auto-generated [cite: 12, 13]

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be a positive number")
    private Long userId; 

    @NotNull(message = "Room ID is required")
    @Positive(message = "Room ID must be a positive number")
    private Long roomId; 

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate; 

    @NotNull(message = "Check-out date is required")
    @FutureOrPresent(message = "Check-out date must be today or in the future")
    private LocalDate checkOutDate; 

    // Status will be set by the service, typically PENDING_PAYMENT initially
    // @NotNull(message = "Status is required") // Removed for initial creation, service sets it
    private String status; // Can still be String for DTO, mapped from Enum by ModelMapper 

    // Include basic payment details needed for initial order creation
    private PaymentDto payment; // This represents the associated payment details 
}