package com.coding.platform.testcase.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.testcase.entity.TestCase;

@Repository
public interface TestCaseRepository
        extends JpaRepository<TestCase, Long> {

    List<TestCase> findByProblemIdOrderByIdAsc(Long problemId);
} 