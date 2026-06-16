package com.socialthings.service;

import com.socialthings.domain.User;
import com.socialthings.dto.auth.AuthSessionResponse;
import com.socialthings.dto.auth.LoginRequest;
import com.socialthings.dto.auth.RegisterRequest;
import com.socialthings.dto.auth.UserResponse;
import com.socialthings.exception.ApiException;
import com.socialthings.repository.UserRepository;
import com.socialthings.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthSessionResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setName(request.name().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        return toSession(user);
    }

    public AuthSessionResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .filter(found -> passwordEncoder.matches(request.password(), found.getPasswordHash()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        return toSession(user);
    }

    public AuthSessionResponse session(User user) {
        return toSession(user);
    }

    private AuthSessionResponse toSession(User user) {
        return new AuthSessionResponse(toUserResponse(user), jwtService.generateToken(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId().toString(), user.getEmail(), user.getName());
    }
}
