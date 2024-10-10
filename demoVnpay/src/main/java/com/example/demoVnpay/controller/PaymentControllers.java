package com.example.demoVnpay.controller;

import com.example.demoVnpay.config.VNPAYConfig;
import com.example.demoVnpay.dto.PaymentDTO;
import com.example.demoVnpay.dto.ResponseObject;
import com.example.demoVnpay.dto.TransactionVerifyRequest;
import com.example.demoVnpay.service.PaymentServices;
import com.example.demoVnpay.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentControllers {
    private final VNPAYConfig vnPayConfig;
    private final PaymentServices paymentService;
    @GetMapping("/vn-pay")
    public ResponseObject<PaymentDTO.VNPayResponse> pay(HttpServletRequest request) {
        return new ResponseObject<>(HttpStatus.OK, "Success", paymentService.createVnPayPayment(request));
    }
    @GetMapping("/vn-pay-callback")
    public void payCallbackHandler(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String status = request.getParameter("vnp_ResponseCode");
        String transactionNo = request.getParameter("vnp_TransactionNo");
        String hmac = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), transactionNo);

        if ("00".equals(status)) {
            response.sendRedirect("http://localhost:5173/cart?TransactionNo=" + transactionNo + "&Hmac=" + hmac);
        } else {
            response.sendRedirect("http://localhost:5173/cart");
        }
    }
    @PostMapping("/verify-transaction")
    public ResponseEntity<String> verifyTransaction(@RequestBody TransactionVerifyRequest request) {
        try {
            String generatedHmac = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), request.getTransactionNo());

            if (generatedHmac.equals(request.getHmac())) {
                return ResponseEntity.ok("Transaction is valid");
            } else {
                return ResponseEntity.badRequest().body(generatedHmac);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying transaction: " + e.getMessage());
        }
    }
}
