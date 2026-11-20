package com.coding.platform.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.submission.entity.Submission;

@Repository
public interface DashboardSubmissionRepository
        extends JpaRepository<Submission, Long> {

    List<Submission> findTop10ByUserIdOrderBySubmittedAtDesc(Long userId);

    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);
}