package cts.lrms.model;

import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoyaltyAccountDTO {
    @Positive(message = "Loyalty ID must be a positive number")
    private int loyaltyId;

    @Positive(message = "User ID must be a positive number")
    private int userId;

    @Min(value = 0, message = "Points balance cannot be negative")
    private int pointsBalance;

    @PastOrPresent(message = "Last updated date cannot be in the future")
    private LocalDateTime lastUpdated;
}
