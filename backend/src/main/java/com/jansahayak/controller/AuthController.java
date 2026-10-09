package com.jansahayak.controller;

import com.jansahayak.dto.AuthResponse;
import com.jansahayak.dto.LoginRequest;
import com.jansahayak.dto.RegisterRequest;
import com.jansahayak.entity.Role;
import com.jansahayak.service.AuthService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(AuthService authService, SecurityContextRepository securityContextRepository) {
        this.authService = authService;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login/user")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        return authenticate(request, Role.USER, httpRequest, httpResponse);
    }

    @PostMapping("/login/admin")
    public ResponseEntity<AuthResponse> loginAdmin(@Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        return authenticate(request, Role.ADMIN, httpRequest, httpResponse);
    }

    private ResponseEntity<AuthResponse> authenticate(LoginRequest request, Role role,
            HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        AuthResponse user = authService.login(request, role);
        var authentication = new UsernamePasswordAuthenticationToken(user.email(), null,
                java.util.List.of(new SimpleGrantedAuthority("ROLE_" + user.role())));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.noContent().build();
    }
}
