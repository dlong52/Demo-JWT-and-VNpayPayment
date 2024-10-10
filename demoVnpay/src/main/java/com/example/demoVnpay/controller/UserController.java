package com.example.demoVnpay.controller;

import com.example.demoVnpay.dto.SigninRequest;
import com.example.demoVnpay.dto.SignupRequest;
import com.example.demoVnpay.model.User;
import com.example.demoVnpay.service.UserServices;
import com.example.demoVnpay.utils.JWTUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserServices userService;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/sign-up")
    public ResponseEntity<String> signUp(@RequestBody SignupRequest signupRequest) {
        try {
            userService.registerUser(signupRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully.");
        } catch (Exception e) {
            logger.error("Error registering user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user.");
        }
    }

    @PostMapping("/sign-in")
    public ResponseEntity<Map<String, String>> signIn(@RequestBody SigninRequest loginRequest) {
        logger.info("Sign in attempt for email: {}", loginRequest.getEmail());
        try {
            // Xác thực người dùng
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            // Lấy thông tin người dùng từ email
            User user = userService.findByEmail(loginRequest.getEmail());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            // Sử dụng user_id để tạo token
            String accessToken = jwtUtils.generateAccessToken(String.valueOf(user.getUserId()));
            String refreshToken = jwtUtils.generateRefreshToken(String.valueOf(user.getUserId()));

            ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .build();

            Map<String, String> response = new HashMap<>();
            response.put("access_token", accessToken);
            response.put("status", "success");

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (BadCredentialsException e) {
            logger.error("Invalid credentials for email: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception e) {
            logger.error("Error during sign in", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(@CookieValue(value = "refresh_token", required = false) String refreshTokenCookie) {
        try {
            // Kiểm tra xem refresh token có tồn tại trong cookie hay không
            if (refreshTokenCookie == null || refreshTokenCookie.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            // Kiểm tra refresh token có hợp lệ không
            if (!jwtUtils.validateRefreshToken(refreshTokenCookie)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            // Lấy user_id từ refresh token
            String userId = jwtUtils.getUserIdFromRefreshToken(refreshTokenCookie);
            // Tạo mới access token
            String newAccessToken = jwtUtils.generateAccessToken(userId);
            // Tạo refresh token mới
            String newRefreshToken = jwtUtils.generateRefreshToken(userId);
            // Thiết lập cookie mới cho refresh token
            ResponseCookie newRefreshTokenCookie = ResponseCookie.from("refresh_token", newRefreshToken)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(24 * 60 * 60) // 1 ngày
                    .build();
            // Tạo response trả về
            Map<String, String> response = new HashMap<>();
            response.put("access_token", newAccessToken);
            response.put("status", "success");
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, newRefreshTokenCookie.toString())
                    .body(response);
        } catch (Exception e) {
            logger.error("Error during token refresh", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Integer userId) {
        try {
            Optional<User> user = userService.getUserById(userId);
            return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
