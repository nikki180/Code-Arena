package com.coding.platform.problem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.problem.entity.Problem;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<Problem> findByIsActiveTrueOrderByIdDesc();
}