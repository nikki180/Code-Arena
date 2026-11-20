package com.coding.platform.submission.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.submission.entity.Submission;

@Repository
public interface SubmissionRepository
        extends JpaRepository<Submission, Long> {

    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);

    List<Submission> findByProblemIdOrderBySubmittedAtDesc(Long problemId);

    List<Submission> findByUserIdAndProblemIdOrderBySubmittedAtDesc(
            Long userId,
            Long problemId
    );
    
}