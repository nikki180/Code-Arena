package com.coding.platform.problem.dto;

import com.coding.platform.problem.entity.Difficulty;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProblemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotBlank(message = "Description is required")
    private String description;

    private String inputFormat;

    private String outputFormat;

    private String constraints;

    private String sampleInput;

    private String sampleOutput;

    private String explanation;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Time limit is required")
    @Min(value = 1, message = "Time limit must be greater than 0")
    private Integer timeLimit;

    @NotNull(message = "Memory limit is required")
    @Min(value = 1, message = "Memory limit must be greater than 0")
    private Integer memoryLimit;

    @NotNull(message = "Points are required")
    @Min(value = 1, message = "Points must be greater than 0")
    private Integer points;

    private String starterCodeJava;

    private String starterCodePython;

    private String starterCodeCpp;

    private String starterCodeJavascript;

    private String editorial;

    private String hints;

    @Min(value = 0, message = "Editorial unlock attempts cannot be negative")
    private Integer editorialUnlockAttempts;


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
}