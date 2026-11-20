package com.coding.platform.dashboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Long userId;

    private String fullName;

    private String email;

    private String profileImage;

    private Integer totalProblemSolved;

    private Integer totalSubmission;

    private Integer currentStreak;

    private Integer maxStreak;

    private List<RecentSubmissionResponse> recentSubmissions;

    private List<LanguageUsageResponse> languageUsage;

    private List<SubmissionHeatmapResponse> submissionHeatmap;
}