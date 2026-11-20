package com.coding.platform.contestsubmission.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.contestsubmission.entity.ContestSubmission;

@Repository
public interface ContestSubmissionRepository
        extends JpaRepository<ContestSubmission, Long> {

    List<ContestSubmission> findByContestIdAndUserIdOrderBySubmittedAtDesc(
            Long contestId,
            Long userId);

    List<ContestSubmission> findByContestIdOrderBySubmittedAtDesc(
            Long contestId);

    List<ContestSubmission> findByContestIdAndProblemIdAndUserIdOrderBySubmittedAtDesc(
            Long contestId,
            Long problemId,
            Long userId);
}