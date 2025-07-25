package cts.lrms.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cts.lrms.entity.LoyaltyAccount;
import cts.lrms.exception.LoyaltyAccountNotFoundException;
import cts.lrms.model.LoyaltyAccountDTO;
import cts.lrms.repository.LoyaltyRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoyaltyServiceImpl implements LoyaltyService {
    @Autowired
    private LoyaltyRepository loyaltyRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public LoyaltyAccountDTO getLoyaltyAccountByUserId(int userId) {
        LoyaltyAccount loyaltyAccount = loyaltyRepository.findByUserId(userId);
        if (loyaltyAccount == null) {
            throw new LoyaltyAccountNotFoundException("User ID " + userId + " not found in loyalty accounts.");
        }
        return modelMapper.map(loyaltyAccount, LoyaltyAccountDTO.class);
    }

    @Override
    public LoyaltyAccountDTO createLoyaltyAccount(int userId) {
        
        if (loyaltyRepository.findByUserId(userId) != null) {
            throw new IllegalArgumentException("Loyalty account for User ID " + userId + " already exists.");
        }

        
        LoyaltyAccount loyaltyAccount = LoyaltyAccount.builder()
                .userId(userId)
                .pointsBalance(0) 
                .lastUpdated(LocalDateTime.now())
                .build();
        LoyaltyAccount savedAccount = loyaltyRepository.save(loyaltyAccount);
        return modelMapper.map(savedAccount, LoyaltyAccountDTO.class);
    }

    @Override
    public LoyaltyAccountDTO addPoints(int userId, int points) {
        LoyaltyAccount loyaltyAccount = loyaltyRepository.findByUserId(userId);
        if (loyaltyAccount == null) {
            throw new LoyaltyAccountNotFoundException("User ID " + userId + " not found in loyalty accounts.");
        }

        loyaltyAccount.setPointsBalance(loyaltyAccount.getPointsBalance() + points);
        loyaltyAccount.setLastUpdated(LocalDateTime.now());

        loyaltyRepository.save(loyaltyAccount);
        return modelMapper.map(loyaltyAccount, LoyaltyAccountDTO.class);
    }

    @Override
    public boolean deleteLoyaltyAccount(int userId) {
        LoyaltyAccount loyaltyAccount = loyaltyRepository.findByUserId(userId);
        if (loyaltyAccount == null) {
            throw new LoyaltyAccountNotFoundException("User ID " + userId + " not found in loyalty accounts.");
        }

        loyaltyRepository.delete(loyaltyAccount);
        return true;
    }

  
    @Override
    public List<LoyaltyAccountDTO> getAllLoyaltyAccounts() {
        List<LoyaltyAccount> loyaltyAccounts = loyaltyRepository.findAll();
        return loyaltyAccounts.stream()
                .map(account -> modelMapper.map(account, LoyaltyAccountDTO.class))
                .collect(Collectors.toList());
    }
    
    @Override
    public int findPointsBalanceByUserId(int userId) {
        LoyaltyAccount account = loyaltyRepository.findByUserId(userId);
        if (account == null) {
            throw new LoyaltyAccountNotFoundException("User ID " + userId + " not found in loyalty accounts.");
        }
        return account.getPointsBalance();
    }
}
