package com.coding.platform.contestscore.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.contestscore.entity.ContestScore;

@Repository
public interface ContestScoreRepository
        extends JpaRepository<ContestScore, Long> {

    Optional<ContestScore> findByContestIdAndUserId(
            Long contestId,
            Long userId);

    List<ContestScore> findByContestIdOrderByTotalScoreDesc(
            Long contestId);
}