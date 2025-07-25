package cts.lrms.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import cts.lrms.model.RedemptionDTO;
import cts.lrms.service.RedemptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@WebMvcTest(controllers = RedemptionController.class)
class RedemptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RedemptionService redemptionService;

    @InjectMocks
    private RedemptionController redemptionController;

    private RedemptionDTO redemptionDTO;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize ObjectMapper with custom date format to handle LocalDateTime serialization
        objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        redemptionDTO = RedemptionDTO.builder()
                .redemptionId(201)
                .userId(1)
                .bookingId(1001)
                .pointsUsed(50)
                .timestamp(LocalDateTime.now()) // Handle this in serialization
                .discountAmount(5.0)
                .build();
    }

    @Test
    void testRedeemPoints_Success() throws Exception {
        when(redemptionService.redeemPoints(1, 1001, 50)).thenReturn(true);

        mockMvc.perform(post("/api/redemption/redeem/1/1001/50")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print());
    }

    @Test
    void testGetRedemptionById_Success() throws Exception {
        when(redemptionService.getRedemptionById(201)).thenReturn(redemptionDTO);

        mockMvc.perform(get("/api/redemption/201")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print());
    }

    @Test
    void testGetAllRedemptions_Success() throws Exception {
        List<RedemptionDTO> mockRedemptions = Arrays.asList(redemptionDTO,
                RedemptionDTO.builder().redemptionId(202).userId(2).bookingId(1002).pointsUsed(30)
                        .timestamp(LocalDateTime.now()).discountAmount(3.0).build());

        when(redemptionService.getAllRedemptions()).thenReturn(mockRedemptions);

        mockMvc.perform(get("/api/redemption/all")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print());
    }

 
    @Test
    void testDeleteRedemption_Success() throws Exception {
        when(redemptionService.deleteRedemption(201)).thenReturn(true);

        mockMvc.perform(delete("/api/redemption/delete/201")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print());
    }
}
