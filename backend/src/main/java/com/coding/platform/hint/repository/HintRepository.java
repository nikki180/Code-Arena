package com.coding.platform.hint.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.hint.entity.Hint;

@Repository
public interface HintRepository extends JpaRepository<Hint, Long> {

    List<Hint> findByProblemIdOrderByHintNumberAsc(Long problemId);
}