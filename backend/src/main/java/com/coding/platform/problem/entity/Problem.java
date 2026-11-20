package com.coding.platform.problem.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "input_format", columnDefinition = "TEXT")
    private String inputFormat;

    @Column(name = "output_format", columnDefinition = "TEXT")
    private String outputFormat;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(name = "sample_input", columnDefinition = "TEXT")
    private String sampleInput;

    @Column(name = "sample_output", columnDefinition = "TEXT")
    private String sampleOutput;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(nullable = false)
    private String category;

    @Column(name = "time_limit", nullable = false)
    private Integer timeLimit;

    @Column(name = "memory_limit", nullable = false)
    private Integer memoryLimit;

    @Column(nullable = false)
    private Integer points;

    @Column(name = "starter_code_java", columnDefinition = "TEXT")
    private String starterCodeJava;

    @Column(name = "starter_code_python", columnDefinition = "TEXT")
    private String starterCodePython;

    @Column(name = "starter_code_cpp", columnDefinition = "TEXT")
    private String starterCodeCpp;

    @Column(name = "starter_code_javascript", columnDefinition = "TEXT")
    private String starterCodeJavascript;

    @Column(columnDefinition = "TEXT")
    private String editorial;

    @Column(columnDefinition = "TEXT")
    private String hints;

    @Column(name = "editorial_unlock_attempts", nullable = false)
    private Integer editorialUnlockAttempts;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInputFormat() {
        return inputFormat;
    }

    public void setInputFormat(String inputFormat) {
        this.inputFormat = inputFormat;
    }

    public String getOutputFormat() {
        return outputFormat;
    }

    public void setOutputFormat(String outputFormat) {
        this.outputFormat = outputFormat;
    }

    public String getConstraints() {
        return constraints;
    }

    public void setConstraints(String constraints) {
        this.constraints = constraints;
    }

    public String getSampleInput() {
        return sampleInput;
    }

    public void setSampleInput(String sampleInput) {
        this.sampleInput = sampleInput;
    }

    public String getSampleOutput() {
        return sampleOutput;
    }

    public void setSampleOutput(String sampleOutput) {
        this.sampleOutput = sampleOutput;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(Integer timeLimit) {
        this.timeLimit = timeLimit;
    }

    public Integer getMemoryLimit() {
        return memoryLimit;
    }

    public void setMemoryLimit(Integer memoryLimit) {
        this.memoryLimit = memoryLimit;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public String getStarterCodeJava() {
        return starterCodeJava;
    }

    public void setStarterCodeJava(String starterCodeJava) {
        this.starterCodeJava = starterCodeJava;
    }

    public String getStarterCodePython() {
        return starterCodePython;
    }

    public void setStarterCodePython(String starterCodePython) {
        this.starterCodePython = starterCodePython;
    }

    public String getStarterCodeCpp() {
        return starterCodeCpp;
    }

    public void setStarterCodeCpp(String starterCodeCpp) {
        this.starterCodeCpp = starterCodeCpp;
    }

    public String getStarterCodeJavascript() {
        return starterCodeJavascript;
    }

    public void setStarterCodeJavascript(String starterCodeJavascript) {
        this.starterCodeJavascript = starterCodeJavascript;
    }

    public String getEditorial() {
        return editorial;
    }

    public void setEditorial(String editorial) {
        this.editorial = editorial;
    }

    public String getHints() {
        return hints;
    }

    public void setHints(String hints) {
        this.hints = hints;
    }

    public Integer getEditorialUnlockAttempts() {
        return editorialUnlockAttempts;
    }

    public void setEditorialUnlockAttempts(Integer editorialUnlockAttempts) {
        this.editorialUnlockAttempts = editorialUnlockAttempts;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}