package com.coding.platform.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coding.platform.user.entity.User;

@Repository
public interface DashboardRepository extends JpaRepository<User, Long> {
}