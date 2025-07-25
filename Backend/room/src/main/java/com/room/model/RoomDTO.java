package com.room.model;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomDTO {

    private Long roomId; // optional during creation

    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    @NotBlank(message = "Room type cannot be empty")
    private String type;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private Double price;

    @NotNull(message = "Availability status is required")
    private Boolean availability;

    @Size(max = 255, message = "Features cannot exceed 255 characters")
    private String features;
    
    @NotBlank(message = "Image url is required")
    private String url;
}
