package com.hotel.model;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HotelDTO {

    private Long hotelId;

    @NotBlank(message = "Hotel name must not be empty")
    private String name;

    @NotBlank(message = "Location must not be empty")
    private String location;

    @Size(max = 255, message = "Amenities description must be 255 characters or fewer")
    private String amenities;

    @DecimalMin(value = "0.0", message = "Rating must be 0 or higher")
    @DecimalMax(value = "5.0", message = "Rating must be 5 or less")
    private Double rating;

    @NotBlank(message = "Image url is required")
    private String url;

    // ⭐ NEW: Added managerId field to DTO (as String for frontend input)
    @NotNull(message = "Manager ID is required")
    @Pattern(regexp = "^[0-9]+$", message = "Manager ID must be a number")
    private String managerId;

    // New field to hold the minimum available room price
    private Double minPrice; // Will be calculated by the service
}