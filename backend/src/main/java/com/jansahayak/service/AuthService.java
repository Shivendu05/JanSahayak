package com.jansahayak.service;

import com.jansahayak.dto.AuthResponse;
import com.jansahayak.dto.LoginRequest;
import com.jansahayak.dto.RegisterRequest;
import com.jansahayak.entity.Role;
import com.jansahayak.entity.User;
import com.jansahayak.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);
        return new AuthResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
                savedUser.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        return login(request, null);
    }

    public AuthResponse login(LoginRequest request, Role requiredRole) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (requiredRole != null && user.getRole() != requiredRole) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
