package com.hotel.controller;

import com.hotel.model.HotelDTO;
import com.hotel.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:5173")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @PostMapping("/create")
    public ResponseEntity<HotelDTO> addHotel(@RequestBody HotelDTO hotelDTO) {
        return ResponseEntity.ok(hotelService.addHotel(hotelDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDTO> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<HotelDTO>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/search")
    public ResponseEntity<List<HotelDTO>> searchHotelsByLocation(@RequestParam String location) {
        System.out.println("Received search request for location: " + location);
        List<HotelDTO> hotels = hotelService.getHotelsByLocation(location);
        return ResponseEntity.ok(hotels);
    }

    // ✅ NEW ENDPOINT: Return all hotel locations (including duplicates)
    @GetMapping("/locations")
    public ResponseEntity<List<String>> getAllHotelLocations() {
        List<String> locations = hotelService.getAllHotelLocations();
        return ResponseEntity.ok(locations);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<HotelDTO> updateHotel(@PathVariable Long id, @RequestBody HotelDTO hotelDTO) {
        return ResponseEntity.ok(hotelService.updateHotel(id, hotelDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.deleteHotelById(id));
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<Boolean> deleteAllHotels() {
        return ResponseEntity.ok(hotelService.deleteAllHotels());
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file) {
        String imageUrl = hotelService.storeImage(file);
        return ResponseEntity.ok(Map.of("url", imageUrl));
    }
}
