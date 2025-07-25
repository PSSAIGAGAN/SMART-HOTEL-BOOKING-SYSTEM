package cts.shbs.entity;

public enum PaymentStatus {
    PENDING,    // When an order is created but payment not yet confirmed
    COMPLETED,  // After successful payment
    FAILED,     // If payment fails
    REFUNDED    // If payment is refunded
}