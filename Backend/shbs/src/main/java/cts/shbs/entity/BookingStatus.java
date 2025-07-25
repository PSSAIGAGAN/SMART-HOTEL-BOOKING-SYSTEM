package cts.shbs.entity;

public enum BookingStatus {
    PENDING_PAYMENT, // Initial status when booking is made and payment is pending
    CONFIRMED,       // After successful payment
    CANCELLED,       // If booking is cancelled
    COMPLETED        // After checkout and service completion
}