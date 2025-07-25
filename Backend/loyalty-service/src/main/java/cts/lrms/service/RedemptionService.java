package cts.lrms.service;

import java.util.List;

import cts.lrms.model.RedemptionDTO;

public interface RedemptionService {
	boolean redeemPoints(int userId, int bookingId, int pointsUsed);
    RedemptionDTO getRedemptionById(int redemptionId);
    List<RedemptionDTO> getAllRedemptions();
    RedemptionDTO updateRedemption(int redemptionId, RedemptionDTO redemptionDTO);
    boolean deleteRedemption(int redemptionId);
    List<RedemptionDTO> getRedemptionHistoryByUserId(int userId);
}
