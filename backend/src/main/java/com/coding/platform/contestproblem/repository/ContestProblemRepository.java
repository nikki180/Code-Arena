package com.coding.platform.contestproblem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.contestproblem.entity.ContestProblem;

@Repository
public interface ContestProblemRepository extends JpaRepository<ContestProblem, Long> {

    List<ContestProblem> findByContestIdOrderByProblemOrderAsc(Long contestId);

    boolean existsByContestIdAndProblemId(Long contestId, Long problemId);
}