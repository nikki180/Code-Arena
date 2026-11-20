package com.coding.platform.contestregistration.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.contestregistration.entity.ContestRegistration;

@Repository
public interface ContestRegistrationRepository
        extends JpaRepository<ContestRegistration, Long> {

    boolean existsByContestIdAndUserId(
            Long contestId,
            Long userId);

    List<ContestRegistration> findByContestIdOrderByRegisteredAtAsc(
            Long contestId);

    List<ContestRegistration> findByUserIdOrderByRegisteredAtDesc(
            Long userId);
}