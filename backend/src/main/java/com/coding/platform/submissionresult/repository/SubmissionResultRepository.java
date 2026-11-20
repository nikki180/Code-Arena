package com.coding.platform.submissionresult.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.submissionresult.entity.SubmissionResult;

@Repository
public interface SubmissionResultRepository
        extends JpaRepository<SubmissionResult, Long> {

    Optional<SubmissionResult> findBySubmissionId(Long submissionId);
}