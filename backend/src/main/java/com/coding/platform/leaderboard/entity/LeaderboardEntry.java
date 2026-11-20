package com.coding.platform.leaderboard.entity;

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
@Table(name = "leaderboard")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Column(name = "total_problems_solved", nullable = false)
    private Integer totalProblemsSolved;

    @Column(name = "total_submissions", nullable = false)
    private Integer totalSubmissions;

    @Column(name = "current_rank", nullable = false)
    private Integer currentRank;

    @Column(name = "last_submission_at")
    private LocalDateTime lastSubmissionAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}