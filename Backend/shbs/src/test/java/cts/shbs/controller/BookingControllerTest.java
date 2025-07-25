package cts.shbs.controller;

import cts.shbs.model.BookingDto;
import cts.shbs.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
public class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private BookingService bookingService;


    private BookingDto bookingDto;

    @BeforeEach
    void setUp() {
    	bookingDto = new BookingDto();
    	bookingDto.setRoomId(101L);
    	bookingDto.setUserId(202L);
    	bookingDto.setCheckInDate(LocalDate.of(2025, 6, 15));
    	bookingDto.setCheckOutDate(LocalDate.of(2025, 6, 20));
    	bookingDto.setStatus("CONFIRMED");

//        bookingDto.setStatus("CONFIRMED");
    }

    @Test
    void testCreateBooking() throws Exception {
        Mockito.when(bookingService.saveBooking(any(BookingDto.class))).thenReturn(bookingDto);

        mockMvc.perform(post("/api/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(bookingDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void testGetAllBookings() throws Exception {
        Mockito.when(bookingService.getAllBookings()).thenReturn(List.of(bookingDto));

        mockMvc.perform(get("/api/bookings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1));
    }

    @Test
    void testGetBookingById() throws Exception {
        Mockito.when(bookingService.getBookingById(1L)).thenReturn(bookingDto);

        mockMvc.perform(get("/api/bookings/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomId").value(101));
    }

    @Test
    void testUpdateBooking() throws Exception {
        Mockito.when(bookingService.updateBooking(any(Long.class), any(BookingDto.class))).thenReturn(bookingDto);

        mockMvc.perform(put("/api/bookings/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(bookingDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(202));
    }

    @Test
    void testDeleteBooking() throws Exception {
        doNothing().when(bookingService).deleteBooking(1L);

        mockMvc.perform(delete("/api/bookings/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Booking deleted successfully."));
    }
}
