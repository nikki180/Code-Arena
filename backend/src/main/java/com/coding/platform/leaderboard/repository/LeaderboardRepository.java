package com.coding.platform.leaderboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.leaderboard.entity.LeaderboardEntry;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {

    List<LeaderboardEntry> findAllByOrderByCurrentRankAsc();

    Optional<LeaderboardEntry> findByUserId(Long userId);
}
