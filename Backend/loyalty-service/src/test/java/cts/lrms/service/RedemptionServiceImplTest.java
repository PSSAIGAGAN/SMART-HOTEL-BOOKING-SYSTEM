package cts.lrms.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import cts.lrms.entity.LoyaltyAccount;
import cts.lrms.entity.Redemption;
import cts.lrms.exception.InsufficientPointsException;
import cts.lrms.exception.RedemptionNotFoundException;
import cts.lrms.model.RedemptionDTO;
import cts.lrms.repository.LoyaltyRepository;
import cts.lrms.repository.RedemptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

class RedemptionServiceImplTest {

    @Mock
    private LoyaltyRepository loyaltyRepository;

    @Mock
    private RedemptionRepository redemptionRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private RedemptionServiceImpl redemptionService;

    private LoyaltyAccount loyaltyAccount;
    private Redemption redemption;
    private RedemptionDTO redemptionDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        loyaltyAccount = LoyaltyAccount.builder()
                .userId(1)
                .pointsBalance(100)
                .lastUpdated(LocalDateTime.now())
                .build();

        redemption = Redemption.builder()
                .redemptionId(201)
                .userId(1)
                .bookingId(1001)
                .pointsUsed(50)
                .timestamp(LocalDateTime.now())
                .discountAmount(5.0)
                .build();

        redemptionDTO = RedemptionDTO.builder()
                .redemptionId(201)
                .userId(1)
                .bookingId(1001)
                .pointsUsed(50)
                .timestamp(LocalDateTime.now())
                .discountAmount(5.0)
                .build();
    }

    @Test
    void testRedeemPoints_Success() {
        when(loyaltyRepository.findByUserId(1)).thenReturn(loyaltyAccount);
        when(redemptionRepository.save(any(Redemption.class))).thenAnswer(invocation -> invocation.getArgument(0));

        boolean result = redemptionService.redeemPoints(1, 1001, 50);

        assertTrue(result);
        assertEquals(50, loyaltyAccount.getPointsBalance()); // Ensure points deduction
        verify(loyaltyRepository, times(1)).save(loyaltyAccount);
        verify(redemptionRepository, times(1)).save(any(Redemption.class));
    }

    @Test
    void testRedeemPoints_InsufficientBalance() {
        when(loyaltyRepository.findByUserId(1)).thenReturn(loyaltyAccount);

        assertThrows(InsufficientPointsException.class, () -> redemptionService.redeemPoints(1, 1001, 150));

        verify(loyaltyRepository, times(1)).findByUserId(1);
        verify(redemptionRepository, never()).save(any(Redemption.class));
    }

    @Test
    void testGetRedemptionById_Success() {
        when(redemptionRepository.findById(201)).thenReturn(Optional.of(redemption));
        when(modelMapper.map(redemption, RedemptionDTO.class)).thenReturn(redemptionDTO);

        RedemptionDTO result = redemptionService.getRedemptionById(201);

        assertNotNull(result);
        assertEquals(201, result.getRedemptionId());

        verify(redemptionRepository, times(1)).findById(201);
        verify(modelMapper, times(1)).map(redemption, RedemptionDTO.class);
    }

    @Test
    void testGetRedemptionById_NotFound() {
        when(redemptionRepository.findById(202)).thenReturn(Optional.empty());

        assertThrows(RedemptionNotFoundException.class, () -> redemptionService.getRedemptionById(202));

        verify(redemptionRepository, times(1)).findById(202);
    }

    @Test
    void testGetAllRedemptions() {
        List<Redemption> redemptions = Arrays.asList(redemption);
        when(redemptionRepository.findAll()).thenReturn(redemptions);
        when(modelMapper.map(redemption, RedemptionDTO.class)).thenReturn(redemptionDTO);

        List<RedemptionDTO> result = redemptionService.getAllRedemptions();

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(redemptionRepository, times(1)).findAll();
        verify(modelMapper, times(1)).map(redemption, RedemptionDTO.class);
    }

    @Test
    void testUpdateRedemption_Success() {
        when(redemptionRepository.findById(201)).thenReturn(Optional.of(redemption));
        when(redemptionRepository.save(any(Redemption.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(modelMapper.map(any(Redemption.class), eq(RedemptionDTO.class))).thenReturn(redemptionDTO);

        RedemptionDTO result = redemptionService.updateRedemption(201, redemptionDTO);

        assertNotNull(result);
        assertEquals(50, result.getPointsUsed());

        verify(redemptionRepository, times(1)).save(any(Redemption.class));
        verify(modelMapper, times(1)).map(any(Redemption.class), eq(RedemptionDTO.class));
    }

    @Test
    void testUpdateRedemption_NotFound() {
        when(redemptionRepository.findById(202)).thenReturn(Optional.empty());

        assertThrows(RedemptionNotFoundException.class, () -> redemptionService.updateRedemption(202, redemptionDTO));

        verify(redemptionRepository, times(1)).findById(202);
        verify(redemptionRepository, never()).save(any(Redemption.class));
    }

    @Test
    void testDeleteRedemption_Success() {
        when(redemptionRepository.findById(201)).thenReturn(Optional.of(redemption));

        boolean result = redemptionService.deleteRedemption(201);

        assertTrue(result);
        verify(redemptionRepository, times(1)).delete(redemption);
    }

    @Test
    void testDeleteRedemption_NotFound() {
        when(redemptionRepository.findById(202)).thenReturn(Optional.empty());

        assertThrows(RedemptionNotFoundException.class, () -> redemptionService.deleteRedemption(202));

        verify(redemptionRepository, times(1)).findById(202);
        verify(redemptionRepository, never()).delete(any(Redemption.class));
    }
}
