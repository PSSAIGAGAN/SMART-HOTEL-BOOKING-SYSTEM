package cts.lrms.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cts.lrms.entity.LoyaltyAccount;
import cts.lrms.entity.Redemption;
import cts.lrms.exception.InsufficientPointsException;
import cts.lrms.exception.RedemptionNotFoundException;
import cts.lrms.model.RedemptionDTO;
import cts.lrms.repository.LoyaltyRepository;
import cts.lrms.repository.RedemptionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RedemptionServiceImpl implements RedemptionService {
    @Autowired
    private LoyaltyRepository loyaltyRepository;

    @Autowired
    private RedemptionRepository redemptionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public boolean redeemPoints(int userId, int bookingId, int pointsUsed) {
       
        LoyaltyAccount account = loyaltyRepository.findByUserId(userId);
        if (account == null || account.getPointsBalance() < pointsUsed) {
            throw new InsufficientPointsException("Insufficient points for redemption.");
        }

       
        account.setPointsBalance(account.getPointsBalance() - pointsUsed);
        account.setLastUpdated(LocalDateTime.now());
        loyaltyRepository.save(account);

        
        Redemption redemption = Redemption.builder()
                .userId(userId)
                .bookingId(bookingId)
                .pointsUsed(pointsUsed)
                .timestamp(LocalDateTime.now())
                .discountAmount(pointsUsed) 
                .build();
        
        redemptionRepository.save(redemption);

        return true;
    }

    @Override
    public RedemptionDTO getRedemptionById(int redemptionId) {
        Redemption redemption = redemptionRepository.findById(redemptionId)
                .orElseThrow(() -> new RedemptionNotFoundException("Redemption ID " + redemptionId + " not found."));
        System.out.println("Timestamp from DB: " + redemption.getTimestamp());

        return modelMapper.map(redemption, RedemptionDTO.class);
    }

    @Override
    public List<RedemptionDTO> getAllRedemptions() {
        List<Redemption> redemptions = redemptionRepository.findAll();
        return redemptions.stream()
                .map(redemption -> modelMapper.map(redemption, RedemptionDTO.class))
                .collect(Collectors.toList());
    }

 
    @Override
    public RedemptionDTO updateRedemption(int redemptionId, RedemptionDTO redemptionDTO) {
        Redemption existingRedemption = redemptionRepository.findById(redemptionId)
                .orElseThrow(() -> new RedemptionNotFoundException("Redemption ID " + redemptionId + " not found."));

        
        existingRedemption.setPointsUsed(redemptionDTO.getPointsUsed());
        existingRedemption.setDiscountAmount(redemptionDTO.getPointsUsed() * 0.1);
        existingRedemption.setTimestamp(LocalDateTime.now());

        Redemption updatedRedemption = redemptionRepository.save(existingRedemption);
        return modelMapper.map(updatedRedemption, RedemptionDTO.class);
    }

    @Override
    public boolean deleteRedemption(int redemptionId) {
        Redemption redemption = redemptionRepository.findById(redemptionId)
                .orElseThrow(() -> new RedemptionNotFoundException("Redemption ID " + redemptionId + " not found."));
        
        redemptionRepository.delete(redemption);
        return true;
    }
    
    @Override
    public List<RedemptionDTO> getRedemptionHistoryByUserId(int userId) {
        List<Redemption> redemptions = redemptionRepository.findByUserId(userId);
        return redemptions.stream()
                .map(redemption -> modelMapper.map(redemption, RedemptionDTO.class))
                .collect(Collectors.toList());
    }

}
