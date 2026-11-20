package com.coding.platform.leaderboard.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.leaderboard.dto.LeaderboardResponse;
import com.coding.platform.leaderboard.entity.LeaderboardEntry;
import com.coding.platform.leaderboard.repository.LeaderboardRepository;
import com.coding.platform.user.repository.UserRepository;

@Service
@Transactional
public class LeaderboardServiceImpl implements LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;

    public LeaderboardServiceImpl(
            LeaderboardRepository leaderboardRepository,
            UserRepository userRepository) {
        this.leaderboardRepository = leaderboardRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardResponse> getLeaderboard() {

        List<LeaderboardEntry> entries = leaderboardRepository.findAllByOrderByCurrentRankAsc();
        Map<Long, String> userNames = userRepository == null ? Map.of() :
                userRepository.findAllById(entries.stream().map(LeaderboardEntry::getUserId).toList())
                        .stream().collect(Collectors.toMap(
                                user -> user.getId(), user -> user.getFullName(), (first, ignored) -> first));
        return entries.stream().map(entry -> mapToResponse(entry, userNames.get(entry.getUserId()))).toList();
    }

    private LeaderboardResponse mapToResponse(LeaderboardEntry entry, String fullName) {

        return LeaderboardResponse.builder()
                .id(entry.getId())
                .userId(entry.getUserId())
                .fullName(fullName)
                .totalScore(entry.getTotalScore())
                .totalProblemsSolved(entry.getTotalProblemsSolved())
                .totalSubmissions(entry.getTotalSubmissions())
                .currentRank(entry.getCurrentRank())
                .lastSubmissionAt(entry.getLastSubmissionAt())
                .updatedAt(entry.getUpdatedAt())
                .build();
    }
}
