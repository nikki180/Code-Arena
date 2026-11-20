package com.coding.platform.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            .csrf(csrf -> csrf.disable())

            .cors(cors -> {})

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Authentication APIs
                .requestMatchers("/api/auth/**")
                .permitAll()

                // Public catalogue and community pages
                .requestMatchers(HttpMethod.GET,
                    "/api/problems/*/test-cases",
                    "/api/problems", "/api/problems/*",
                    "/api/leaderboard", "/api/contests", "/api/contests/*")
                .permitAll()

                // Browsers send CORS preflight requests without a JWT
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

                // Swagger
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                )
                .permitAll()

                // Hint Apis require login
                .requestMatchers("/api/hints/**")
                .authenticated()

                // Everything else
                .anyRequest()
                .authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
