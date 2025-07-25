package cts.lrms.controller;

import cts.lrms.model.RedemptionDTO;
import cts.lrms.service.RedemptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/redemption-api")
@CrossOrigin(origins = "http://localhost:5173/")
public class RedemptionController {

    private static final Logger logger = LoggerFactory.getLogger(RedemptionController.class);

    @Autowired
    private RedemptionService redemptionService;

    @PostMapping("/redeem/{userId}/{bookingId}/{pointsUsed}")
    public ResponseEntity<Boolean> redeemPoints(
            @PathVariable int userId,
            @PathVariable int bookingId,
            @PathVariable int pointsUsed) {
        logger.info("Redeeming {} points for userId {} and bookingId {}", pointsUsed, userId, bookingId);
        boolean success = redemptionService.redeemPoints(userId, bookingId, pointsUsed);
        logger.debug("Redemption status: {}", success);
        return ResponseEntity.ok(success);
    }

    @GetMapping("/{redemptionId}")
    public ResponseEntity<RedemptionDTO> getRedemptionById(@PathVariable int redemptionId) {
        logger.info("Fetching redemption with ID: {}", redemptionId);
        RedemptionDTO redemption = redemptionService.getRedemptionById(redemptionId);
        logger.debug("Fetched redemption: {}", redemption);
        return ResponseEntity.ok(redemption);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RedemptionDTO>> getAllRedemptions() {
        logger.info("Fetching all redemptions");
        List<RedemptionDTO> redemptions = redemptionService.getAllRedemptions();
        logger.debug("Total redemptions fetched: {}", redemptions.size());
        return ResponseEntity.ok(redemptions);
    }

    @PutMapping("/update/{redemptionId}")
    public ResponseEntity<RedemptionDTO> updateRedemption(
            @PathVariable int redemptionId,
            @RequestBody RedemptionDTO redemptionDTO) {
        logger.info("Updating redemption ID {} with new data", redemptionId);
        RedemptionDTO updated = redemptionService.updateRedemption(redemptionId, redemptionDTO);
        logger.debug("Updated redemption: {}", updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{redemptionId}")
    public ResponseEntity<Boolean> deleteRedemption(@PathVariable int redemptionId) {
        logger.info("Deleting redemption with ID: {}", redemptionId);
        boolean deleted = redemptionService.deleteRedemption(redemptionId);
        logger.debug("Deletion status for ID {}: {}", redemptionId, deleted);
        return ResponseEntity.ok(deleted);
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<RedemptionDTO>> getRedemptionHistoryByUserId(@PathVariable int userId) {
        logger.info("Fetching redemption history for userId: {}", userId);
        List<RedemptionDTO> history = redemptionService.getRedemptionHistoryByUserId(userId);
        logger.debug("Redemption history size for userId {}: {}", userId, history.size());
        return ResponseEntity.ok(history);
    }
}
