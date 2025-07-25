package cts.shbs.controller;

import cts.shbs.model.PaymentDto;
import cts.shbs.service.PaymentServiceImp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaymentControllerTest {

    @Mock
    private PaymentServiceImp paymentService;

    @InjectMocks
    private PaymentController paymentController;

    private PaymentDto paymentDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        paymentDto = new PaymentDto();
        paymentDto.setPaymentId(1L);
        paymentDto.setUserId(101L);
        paymentDto.setAmount(2500.0);
        paymentDto.setStatus("SUCCESS");
        paymentDto.setPaymentMethod("CREDIT_CARD");
    }

    @Test
    void testCreatePayment() {
        when(paymentService.savePayment(any(PaymentDto.class))).thenReturn(paymentDto);

        ResponseEntity<PaymentDto> response = paymentController.createPayment(paymentDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(101L, response.getBody().getUserId());
    }

    @Test
    void testGetAllPayments() {
        List<PaymentDto> payments = Arrays.asList(paymentDto);
        when(paymentService.getAllPayment()).thenReturn(payments);

        ResponseEntity<List<PaymentDto>> response = paymentController.getAllPayments();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testGetPaymentById() {
        when(paymentService.getPaymentById(1L)).thenReturn(paymentDto);

        ResponseEntity<PaymentDto> response = paymentController.getPaymentById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("SUCCESS", response.getBody().getStatus());
    }

    @Test
    void testUpdatePayment() {
        PaymentDto updatedDto = new PaymentDto();
        updatedDto.setPaymentId(1L);
        updatedDto.setUserId(102L);
        updatedDto.setAmount(3000.0);
        updatedDto.setStatus("UPDATED");
        updatedDto.setPaymentMethod("DEBIT_CARD");

        when(paymentService.updatePayment(eq(1L), any(PaymentDto.class))).thenReturn(updatedDto);

        ResponseEntity<PaymentDto> response = paymentController.updatePayment(1L, updatedDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("UPDATED", response.getBody().getStatus());
    }

    @Test
    void testDeletePayment() {
        doNothing().when(paymentService).deletePayment(1L);

        ResponseEntity<String> response = paymentController.deletePayment(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Payment deleted successfully.", response.getBody());
        verify(paymentService, times(1)).deletePayment(1L);
    }
}
