package cts.lrms.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import cts.lrms.entity.LoyaltyAccount;
import cts.lrms.exception.LoyaltyAccountNotFoundException;
import cts.lrms.model.LoyaltyAccountDTO;
import cts.lrms.repository.LoyaltyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

class LoyaltyServiceImplTest {

    @Mock
    private LoyaltyRepository loyaltyRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private LoyaltyServiceImpl loyaltyService;

    private LoyaltyAccount loyaltyAccount;
    private LoyaltyAccountDTO loyaltyAccountDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        loyaltyAccount = LoyaltyAccount.builder()
                .userId(1)
                .pointsBalance(100)
                .lastUpdated(LocalDateTime.now())
                .build();

        loyaltyAccountDTO = LoyaltyAccountDTO.builder()
                .userId(1)
                .pointsBalance(100)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    @Test
    void testGetLoyaltyAccountByUserId_Success() {
        when(loyaltyRepository.findByUserId(1)).thenReturn(loyaltyAccount);
        when(modelMapper.map(loyaltyAccount, LoyaltyAccountDTO.class)).thenReturn(loyaltyAccountDTO);

        LoyaltyAccountDTO result = loyaltyService.getLoyaltyAccountByUserId(1);

        assertNotNull(result);
        assertEquals(1, result.getUserId());
        assertEquals(100, result.getPointsBalance());

        verify(loyaltyRepository, times(1)).findByUserId(1);
        verify(modelMapper, times(1)).map(loyaltyAccount, LoyaltyAccountDTO.class);
    }

    @Test
    void testGetLoyaltyAccountByUserId_NotFound() {
        when(loyaltyRepository.findByUserId(2)).thenReturn(null);

        assertThrows(LoyaltyAccountNotFoundException.class, () -> loyaltyService.getLoyaltyAccountByUserId(2));

        verify(loyaltyRepository, times(1)).findByUserId(2);
    }

    @Test
    void testCreateLoyaltyAccount_Success() {
        when(loyaltyRepository.findByUserId(1)).thenReturn(null);
        when(loyaltyRepository.save(any(LoyaltyAccount.class))).thenReturn(loyaltyAccount);
        when(modelMapper.map(loyaltyAccount, LoyaltyAccountDTO.class)).thenReturn(loyaltyAccountDTO);

        LoyaltyAccountDTO result = loyaltyService.createLoyaltyAccount(1);

        assertNotNull(result);
        assertEquals(1, result.getUserId());

        verify(loyaltyRepository, times(1)).save(any(LoyaltyAccount.class));
        verify(modelMapper, times(1)).map(loyaltyAccount, LoyaltyAccountDTO.class);
    }

    @Test
    void testCreateLoyaltyAccount_AlreadyExists() {
        when(loyaltyRepository.findByUserId(1)).thenReturn(loyaltyAccount);

        assertThrows(IllegalArgumentException.class, () -> loyaltyService.createLoyaltyAccount(1));

        verify(loyaltyRepository, times(1)).findByUserId(1);
    }

    @Test
    void testAddPoints_Success() {
        when(loyaltyRepository.findByUserId(1)).thenReturn(loyaltyAccount);
        
        // Make sure the save method returns the updated object
        when(loyaltyRepository.save(any(LoyaltyAccount.class))).thenAnswer(invocation -> {
            LoyaltyAccount updatedAccount = invocation.getArgument(0);
            return updatedAccount; // Return the modified entity
        });

        when(modelMapper.map(any(LoyaltyAccount.class), eq(LoyaltyAccountDTO.class)))
                .thenReturn(loyaltyAccountDTO);

        LoyaltyAccountDTO result = loyaltyService.addPoints(1, 50);

        assertNotNull(result);
        assertEquals(150, loyaltyAccount.getPointsBalance()); // Check the updated balance

        verify(loyaltyRepository, times(1)).save(loyaltyAccount);
        verify(modelMapper, times(1)).map(loyaltyAccount, LoyaltyAccountDTO.class);
    }


    @Test
    void testAddPoints_UserNotFound() {
        when(loyaltyRepository.findByUserId(2)).thenReturn(null);

        assertThrows(LoyaltyAccountNotFoundException.class, () -> loyaltyService.addPoints(2, 50));

        verify(loyaltyRepository, times(1)).findByUserId(2);
    }

    @Test
    void testDeleteLoyaltyAccount_Success() {
        when(loyaltyRepository.findByUserId(1)).thenReturn(loyaltyAccount);

        boolean result = loyaltyService.deleteLoyaltyAccount(1);

        assertTrue(result);

        verify(loyaltyRepository, times(1)).delete(loyaltyAccount);
    }

    @Test
    void testDeleteLoyaltyAccount_NotFound() {
        when(loyaltyRepository.findByUserId(2)).thenReturn(null);

        assertThrows(LoyaltyAccountNotFoundException.class, () -> loyaltyService.deleteLoyaltyAccount(2));

        verify(loyaltyRepository, times(1)).findByUserId(2);
    }

    @Test
    void testGetAllLoyaltyAccounts() {
        List<LoyaltyAccount> loyaltyAccounts = Arrays.asList(loyaltyAccount);
        when(loyaltyRepository.findAll()).thenReturn(loyaltyAccounts);
        when(modelMapper.map(loyaltyAccount, LoyaltyAccountDTO.class)).thenReturn(loyaltyAccountDTO);

        List<LoyaltyAccountDTO> result = loyaltyService.getAllLoyaltyAccounts();

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(loyaltyRepository, times(1)).findAll();
        verify(modelMapper, times(1)).map(loyaltyAccount, LoyaltyAccountDTO.class);
    }
}
