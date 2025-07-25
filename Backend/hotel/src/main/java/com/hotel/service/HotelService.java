package com.hotel.service;

import com.hotel.model.HotelDTO;
import com.hotel.model.RoomDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HotelService {
    HotelDTO addHotel(HotelDTO hotelDTO);
    HotelDTO getHotelById(Long id);
    List<HotelDTO> getAllHotels();
    HotelDTO updateHotel(Long id, HotelDTO hotelDTO);
    boolean deleteHotelById(Long id);
    boolean deleteAllHotels();
    String storeImage(MultipartFile file);

    List<HotelDTO> getHotelsByLocation(String location);

    // This method exists to expose the Feign client call directly if needed,
    // but its primary use is internal within HotelServiceImpl now.
    List<RoomDTO> getRoomsForHotel(Long hotelId);
    List<String> getAllHotelLocations();

}