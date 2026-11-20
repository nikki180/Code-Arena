package com.coding.platform.hint.entity;

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
@Table(name = "hints")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(name = "hint_number", nullable = false)
    private Integer hintNumber;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String hintText;
}