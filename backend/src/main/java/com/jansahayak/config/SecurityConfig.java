package com.jansahayak.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            SecurityContextRepository securityContextRepository) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .securityContext(context -> context.securityContextRepository(securityContextRepository))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/h2-console/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/schemes/**", "/api/videos/**", "/api/resources/**")
                        .permitAll()
                        .requestMatchers("/api/dashboard").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/schemes/**", "/api/videos/**", "/api/resources/**")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/schemes/**", "/api/videos/**", "/api/resources/**")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/schemes/**", "/api/videos/**", "/api/resources/**")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/bookmarks/*").hasRole("ADMIN")
                        .requestMatchers("/api/bookmarks/**").authenticated()
                        .anyRequest().permitAll())
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }
}
