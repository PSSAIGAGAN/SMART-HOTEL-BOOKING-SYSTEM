package cts.lrms.controller;

import cts.lrms.model.LoyaltyAccountDTO;
import cts.lrms.service.LoyaltyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loyalty-api")
@CrossOrigin(origins = "http://localhost:5173/")
public class LoyaltyController {

    private static final Logger logger = LoggerFactory.getLogger(LoyaltyController.class);

    @Autowired
    private LoyaltyService loyaltyService;

    @GetMapping("/{userId}")
    public ResponseEntity<LoyaltyAccountDTO> getLoyaltyAccount(@PathVariable int userId) {
        logger.info("Fetching loyalty account for userId: {}", userId);
        LoyaltyAccountDTO account = loyaltyService.getLoyaltyAccountByUserId(userId);
        logger.debug("Fetched loyalty account: {}", account);
        return ResponseEntity.ok(account);
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<LoyaltyAccountDTO> createLoyaltyAccount(@PathVariable int userId) {
        logger.info("Creating loyalty account for userId: {}", userId);
        LoyaltyAccountDTO account = loyaltyService.createLoyaltyAccount(userId);
        logger.debug("Created loyalty account: {}", account);
        return ResponseEntity.ok(account);
    }

    @PutMapping("/addPoints/{userId}/{points}")
    public ResponseEntity<LoyaltyAccountDTO> addPoints(@PathVariable int userId, @PathVariable int points) {
        logger.info("Adding {} points to userId: {}", points, userId);
        LoyaltyAccountDTO account = loyaltyService.addPoints(userId, points);
        logger.debug("Updated loyalty account after adding points: {}", account);
        return ResponseEntity.ok(account);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Boolean> deleteLoyaltyAccount(@PathVariable int userId) {
        logger.info("Deleting loyalty account for userId: {}", userId);
        boolean deleted = loyaltyService.deleteLoyaltyAccount(userId);
        logger.debug("Delete status for userId {}: {}", userId, deleted);
        return ResponseEntity.ok(deleted);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LoyaltyAccountDTO>> getAllLoyaltyAccounts() {
        logger.info("Fetching all loyalty accounts");
        List<LoyaltyAccountDTO> accounts = loyaltyService.getAllLoyaltyAccounts();
        logger.debug("Fetched accounts: {}", accounts);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/getpoints/{userId}")
    public ResponseEntity<Integer> findPointsBalanceByUserId(@PathVariable int userId) {
        logger.info("Retrieving points balance for userId: {}", userId);
        int points = loyaltyService.findPointsBalanceByUserId(userId);
        logger.debug("Points balance for userId {}: {}", userId, points);
        return ResponseEntity.ok(points);
    }
}
