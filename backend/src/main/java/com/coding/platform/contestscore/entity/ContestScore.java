package com.coding.platform.contestscore.entity;

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
@Table(name = "contest_scores")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contest_id", nullable = false)
    private Long contestId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Column(name = "problems_solved", nullable = false)
    private Integer problemsSolved;

    @Column(name = "total_submissions", nullable = false)
    private Integer totalSubmissions;

    @Column(name = "current_rank", nullable = false)
    private Integer currentRank;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}