package com.hotel.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// This DTO mirrors the essential fields returned by RoomService's RoomDTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Long roomId;
    private Long hotelId;
    private Double price;
    private Boolean availability;
    // Add other fields from RoomService's RoomDTO if needed for display/logic in Hotel Service
    private String type;
    private String features;
    private String url;
}