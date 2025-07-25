package cts.lrms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoyaltyAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int loyaltyId;

    private int userId;
    private int pointsBalance;
    private LocalDateTime lastUpdated;
}
