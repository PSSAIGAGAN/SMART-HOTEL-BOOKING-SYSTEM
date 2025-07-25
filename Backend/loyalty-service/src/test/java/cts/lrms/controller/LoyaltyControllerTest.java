package cts.lrms.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

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

import com.fasterxml.jackson.databind.ObjectMapper;

import cts.lrms.model.LoyaltyAccountDTO;
import cts.lrms.service.LoyaltyServiceImpl;

@WebMvcTest(controllers = LoyaltyController.class)
class LoyaltyControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private LoyaltyServiceImpl loyaltyService;

    @InjectMocks
    private LoyaltyController loyaltyController;

    private LoyaltyAccountDTO loyaltyAccountDTO;

    @BeforeEach
    public void setUp() {
        loyaltyAccountDTO = LoyaltyAccountDTO.builder()
                .loyaltyId(101)
                .userId(1)
                .pointsBalance(100)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    @Test
    void testGetLoyaltyAccount() throws Exception {
        Mockito.when(loyaltyService.getLoyaltyAccountByUserId(1)).thenReturn(loyaltyAccountDTO);

        mockMvc.perform(get("/api/loyalty/1").accept(MediaType.APPLICATION_JSON))
                .andDo(print());
    }

    @Test
    void testCreateLoyaltyAccount() throws Exception {
        Mockito.when(loyaltyService.createLoyaltyAccount(1)).thenReturn(loyaltyAccountDTO);

        mockMvc.perform(post("/api/loyalty/create/1")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print());
    }

    @Test
    void testAddPoints() throws Exception {
        Mockito.when(loyaltyService.addPoints(1, 50)).thenReturn(loyaltyAccountDTO);

        mockMvc.perform(put("/api/loyalty/addPoints/1/50")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print());
    }

    @Test
    void testDeleteLoyaltyAccount() throws Exception {
        Mockito.when(loyaltyService.deleteLoyaltyAccount(1)).thenReturn(true);

        mockMvc.perform(delete("/api/loyalty/delete/1")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print());
    }

    @Test
    void testGetAllLoyaltyAccounts() throws Exception {
        List<LoyaltyAccountDTO> mockAccounts = new ArrayList<>();
        mockAccounts.add(loyaltyAccountDTO);
        mockAccounts.add(LoyaltyAccountDTO.builder().loyaltyId(102).userId(2).pointsBalance(200).lastUpdated(LocalDateTime.now()).build());

        Mockito.when(loyaltyService.getAllLoyaltyAccounts()).thenReturn(mockAccounts);

        mockMvc.perform(get("/api/loyalty/all").accept(MediaType.APPLICATION_JSON))
                .andDo(print());
    }
}
