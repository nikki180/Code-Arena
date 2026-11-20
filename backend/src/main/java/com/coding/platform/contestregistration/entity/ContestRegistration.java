package com.coding.platform.contestregistration.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contest_registrations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contest_id", nullable = false)
    private Long contestId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt;

    @Column(nullable = false, length = 20)
    private String status;
}