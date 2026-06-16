package com.socialthings.dto.auth;

public record AuthSessionResponse(UserResponse user, String token) {}
