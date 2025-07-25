package cts.lrms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import cts.lrms.entity.Redemption;

public interface RedemptionRepository extends JpaRepository<Redemption, Integer> {
	List<Redemption> findByUserId(int userId);

}
