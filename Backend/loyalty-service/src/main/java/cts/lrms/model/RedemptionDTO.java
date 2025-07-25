package cts.lrms.model;

import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RedemptionDTO {
    @Positive(message = "Redemption ID must be a positive number")
    private int redemptionId;

    @Positive(message = "User ID must be a positive number")
    private int userId;

    @Positive(message = "Booking ID must be a positive number")
    private int bookingId;

    @Min(value = 1, message = "Points used must be at least 1")
    private int pointsUsed;

    @DecimalMin(value = "0.0", message = "Discount amount cannot be negative")
    private double discountAmount;

    @PastOrPresent(message = "Timestamp cannot be in the future")
    private LocalDateTime timestamp;
}
