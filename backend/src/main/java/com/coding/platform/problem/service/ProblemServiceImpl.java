package com.coding.platform.problem.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.problem.dto.ProblemRequest;
import com.coding.platform.problem.dto.ProblemResponse;
import com.coding.platform.problem.entity.Problem;
import com.coding.platform.problem.repository.ProblemRepository;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;
import com.coding.platform.util.ApiResponse;

@Service
@Transactional
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    public ProblemServiceImpl(
            ProblemRepository problemRepository,
            UserRepository userRepository) {

        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
    }


    // =========================================================
    // CREATE
    // =========================================================

    @Override
    public ApiResponse<ProblemResponse> createProblem(
            ProblemRequest request) {

        if (problemRepository.existsBySlug(request.getSlug())) {

            return new ApiResponse<>(
                    false,
                    "Problem with this slug already exists",
                    null
            );
        }

        User currentUser = getCurrentUser();

        Problem problem = new Problem();

        mapRequestToEntity(request, problem);

        LocalDateTime now = LocalDateTime.now();

        problem.setCreatedBy(currentUser.getId());
        problem.setCreatedAt(now);
        problem.setUpdatedAt(now);
        problem.setIsActive(true);

        if (request.getEditorialUnlockAttempts() == null) {
            problem.setEditorialUnlockAttempts(0);
        }

        Problem savedProblem =
                problemRepository.save(problem);

        return new ApiResponse<>(
                true,
                "Problem created successfully",
                mapToResponse(savedProblem)
        );
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<ProblemResponse> getProblemById(Long id) {

        Problem problem =
                problemRepository.findById(id)
                        .orElse(null);

        if (problem == null || !Boolean.TRUE.equals(problem.getIsActive())) {

            return new ApiResponse<>(
                    false,
                    "Problem not found with id: " + id,
                    null
            );
        }

        return new ApiResponse<>(
                true,
                "Problem fetched successfully",
                mapToResponse(problem)
        );
    }


    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<ProblemResponse>> getAllProblems() {

        List<ProblemResponse> problems =
                problemRepository
                        .findByIsActiveTrueOrderByIdDesc()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        return new ApiResponse<>(
                true,
                "Problems fetched successfully",
                problems
        );
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    public ApiResponse<ProblemResponse> updateProblem(
            Long id,
            ProblemRequest request) {

        Problem problem =
                problemRepository.findById(id)
                        .orElse(null);

        if (problem == null || !Boolean.TRUE.equals(problem.getIsActive())) {

            return new ApiResponse<>(
                    false,
                    "Problem not found with id: " + id,
                    null
            );
        }

        if (problemRepository.existsBySlugAndIdNot(
                request.getSlug(),
                id)) {

            return new ApiResponse<>(
                    false,
                    "Another problem already uses this slug",
                    null
            );
        }

        mapRequestToEntity(request, problem);

        problem.setUpdatedAt(LocalDateTime.now());

        Problem updatedProblem =
                problemRepository.save(problem);

        return new ApiResponse<>(
                true,
                "Problem updated successfully",
                mapToResponse(updatedProblem)
        );
    }


    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public ApiResponse<String> deleteProblem(Long id) {

        Problem problem =
                problemRepository.findById(id)
                        .orElse(null);

        if (problem == null || !Boolean.TRUE.equals(problem.getIsActive())) {

            return new ApiResponse<>(
                    false,
                    "Problem not found with id: " + id,
                    null
            );
        }

        // Soft delete
        problem.setIsActive(false);
        problem.setUpdatedAt(LocalDateTime.now());

        problemRepository.save(problem);

        return new ApiResponse<>(
                true,
                "Problem deleted successfully",
                "Problem with id " + id + " has been deactivated"
        );
    }


    // =========================================================
    // GET CURRENT USER
    // =========================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Authenticated user not found"
            );
        }

        String email;

        Object principal =
                authentication.getPrincipal();

        if (principal instanceof UserDetails userDetails) {

            email = userDetails.getUsername();

        } else {

            email = authentication.getName();
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );
    }


    // =========================================================
    // REQUEST → ENTITY
    // =========================================================

    private void mapRequestToEntity(
            ProblemRequest request,
            Problem problem) {

        problem.setTitle(request.getTitle());
        problem.setSlug(request.getSlug());
        problem.setDescription(request.getDescription());

        problem.setInputFormat(
                request.getInputFormat()
        );

        problem.setOutputFormat(
                request.getOutputFormat()
        );

        problem.setConstraints(
                request.getConstraints()
        );

        problem.setSampleInput(
                request.getSampleInput()
        );

        problem.setSampleOutput(
                request.getSampleOutput()
        );

        problem.setExplanation(
                request.getExplanation()
        );

        problem.setDifficulty(
                request.getDifficulty()
        );

        problem.setCategory(
                request.getCategory()
        );

        problem.setTimeLimit(
                request.getTimeLimit()
        );

        problem.setMemoryLimit(
                request.getMemoryLimit()
        );

        problem.setPoints(
                request.getPoints()
        );

        problem.setStarterCodeJava(
                request.getStarterCodeJava()
        );

        problem.setStarterCodePython(
                request.getStarterCodePython()
        );

        problem.setStarterCodeCpp(
                request.getStarterCodeCpp()
        );

        problem.setStarterCodeJavascript(
                request.getStarterCodeJavascript()
        );

        problem.setEditorial(
                request.getEditorial()
        );

        problem.setHints(
                request.getHints()
        );

        problem.setEditorialUnlockAttempts(
                request.getEditorialUnlockAttempts() != null
                        ? request.getEditorialUnlockAttempts()
                        : 0
        );
    }


    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private ProblemResponse mapToResponse(
            Problem problem) {

        ProblemResponse response =
                new ProblemResponse();

        response.setId(problem.getId());

        response.setTitle(problem.getTitle());
        response.setSlug(problem.getSlug());
        response.setDescription(problem.getDescription());

        response.setInputFormat(
                problem.getInputFormat()
        );

        response.setOutputFormat(
                problem.getOutputFormat()
        );

        response.setConstraints(
                problem.getConstraints()
        );

        response.setSampleInput(
                problem.getSampleInput()
        );

        response.setSampleOutput(
                problem.getSampleOutput()
        );

        response.setExplanation(
                problem.getExplanation()
        );

        response.setDifficulty(
                problem.getDifficulty()
        );

        response.setCategory(
                problem.getCategory()
        );

        response.setTimeLimit(
                problem.getTimeLimit()
        );

        response.setMemoryLimit(
                problem.getMemoryLimit()
        );

        response.setPoints(
                problem.getPoints()
        );

        response.setStarterCodeJava(
                problem.getStarterCodeJava()
        );

        response.setStarterCodePython(
                problem.getStarterCodePython()
        );

        response.setStarterCodeCpp(
                problem.getStarterCodeCpp()
        );

        response.setStarterCodeJavascript(
                problem.getStarterCodeJavascript()
        );

        response.setEditorial(
                problem.getEditorial()
        );

        response.setHints(
                problem.getHints()
        );

        response.setEditorialUnlockAttempts(
                problem.getEditorialUnlockAttempts()
        );

        response.setCreatedBy(
                problem.getCreatedBy()
        );

        response.setIsActive(
                problem.getIsActive()
        );

        response.setCreatedAt(
                problem.getCreatedAt()
        );

        response.setUpdatedAt(
                problem.getUpdatedAt()
        );

        return response;
    }
}