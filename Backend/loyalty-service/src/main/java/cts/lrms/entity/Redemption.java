package cts.lrms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Redemption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int redemptionId;

    private int userId;
    private int bookingId;
    private int pointsUsed;
    private double discountAmount;
    @Column(name = "timestamp", nullable = false) 
    private LocalDateTime timestamp;
}
