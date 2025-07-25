package cts.lrms.service;

import java.util.List;

import cts.lrms.model.LoyaltyAccountDTO;

public interface LoyaltyService {
	LoyaltyAccountDTO getLoyaltyAccountByUserId(int userId);
    LoyaltyAccountDTO createLoyaltyAccount(int userId);
    LoyaltyAccountDTO addPoints(int userId, int points);
    boolean deleteLoyaltyAccount(int userId);
    List<LoyaltyAccountDTO> getAllLoyaltyAccounts();
    int findPointsBalanceByUserId(int userId);

}
