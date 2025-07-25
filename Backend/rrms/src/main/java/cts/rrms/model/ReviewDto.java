package cts.rrms.model;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDto {
    private int reviewId;

    @NotNull(message = "User ID should not be null, please provide a user ID")
    private int userId; 

    @NotNull(message = "Hotel ID should not be null, please enter hotel ID")
    private int hotelId;

    @NotNull(message = "Rating should not be null, please provide rating")
    @Min(value = 1, message = "Rating should be at least 1")
    @Max(value = 5, message = "Rating should not exceed 5")
    private int rating;

    @NotBlank(message = "Comments should not be empty")
    private String comment;

    private LocalDateTime timestamp;
    private String managerReply;
    private String username;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }


}
