package com.example.demoVnpay.repository;

import com.example.demoVnpay.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserName(String userName);
    Optional<User> findByEmail(String email);
    void deleteByEmail(String email);
    boolean existsByUserName(String userName);
}

