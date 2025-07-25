
package cts.shbs.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private Long userId;

    private Long roomId;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    // Change status to an Enum for better type safety
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY) // CascadeType.ALL will manage Payment lifecycle with Booking
    @JoinColumn(name = "payment_id", referencedColumnName = "payment_id") // Use "payment_id" for consistency, matching Payment's PK column
    private Payment payment; // This is the actual link to the Payment entity
}