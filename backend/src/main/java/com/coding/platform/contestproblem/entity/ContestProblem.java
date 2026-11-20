package com.coding.platform.contestproblem.entity;

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
@Table(name = "contest_problems")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contest_id", nullable = false)
    private Long contestId;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(name = "problem_order", nullable = false)
    private Integer problemOrder;

    @Column(name = "points", nullable = false)
    private Integer points;
}