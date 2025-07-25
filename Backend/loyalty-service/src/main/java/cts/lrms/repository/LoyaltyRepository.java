package cts.lrms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cts.lrms.entity.LoyaltyAccount;

public interface LoyaltyRepository extends JpaRepository<LoyaltyAccount, Integer> {
    LoyaltyAccount findByUserId(int userId);
}
