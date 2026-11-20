package com.coding.platform.contest.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.contest.entity.Contest;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Long> {

    List<Contest> findAllByOrderByStartTimeAsc();

}