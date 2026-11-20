package com.coding.platform.execution.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import com.coding.platform.execution.dto.ExecutionResult;
import com.coding.platform.execution.util.OutputComparator;

@Service
public class DockerExecutionService implements CodeExecutionService {

    private final OutputComparator outputComparator;

    public DockerExecutionService(
            OutputComparator outputComparator) {

        this.outputComparator = outputComparator;
    }

    @Override
    public ExecutionResult execute(
            String language,
            String sourceCode,
            String input,
            String expectedOutput) {

        long startTime = System.currentTimeMillis();

        try {

            String image = getDockerImage(language);

            String command = getCommand(
                    language,
                    sourceCode
            );

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "docker",
                    "run",
                    "--rm",
                    "-i",
                    "--cpus=1",
                    "--memory=256m",
                    "--memory-swap=256m",
                    "--pids-limit=64",
                    "--network",
                    "none",
                    image,
                    "sh",
                    "-c",
                    command
            );

            processBuilder.redirectErrorStream(false);

            Process process = processBuilder.start();

            CompletableFuture<String> outputFuture = CompletableFuture.supplyAsync(
                    () -> readStreamSafely(process.getInputStream()));
            CompletableFuture<String> errorFuture = CompletableFuture.supplyAsync(
                    () -> readStreamSafely(process.getErrorStream()));

            // =====================================================
            // SEND PROGRAM INPUT TO STDIN
            // =====================================================

            try (OutputStream outputStream =
                         process.getOutputStream()) {

                if (input != null) {

                    outputStream.write(
                            input.getBytes(StandardCharsets.UTF_8)
                    );
                }

                outputStream.flush();
            }

            // =====================================================
            // READ PROGRAM OUTPUT
            // =====================================================

            boolean finished = process.waitFor(15, TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                return ExecutionResult.builder()
                        .success(false)
                        .status("TIME_LIMIT_EXCEEDED")
                        .output("")
                        .errorMessage("Execution exceeded the 15 second limit.")
                        .executionTime(System.currentTimeMillis() - startTime)
                        .testCasesPassed(0)
                        .totalTestCases(1)
                        .build();
            }

            String output = outputFuture.join();
            String error = errorFuture.join();

            long executionTime =
                    System.currentTimeMillis() - startTime;

            // =====================================================
            // RUNTIME / COMPILATION ERROR
            // =====================================================

            if (process.exitValue() != 0) {
                String dockerUnavailableMessage = dockerUnavailableMessage(error);
                if (dockerUnavailableMessage != null) {
                    return ExecutionResult.builder()
                            .success(false)
                            .status("EXECUTION_ERROR")
                            .output(output)
                            .errorMessage(dockerUnavailableMessage)
                            .executionTime(executionTime)
                            .testCasesPassed(0)
                            .totalTestCases(1)
                            .build();
                }

                String executionStatus = isCompilationError(language, error)
                        ? "COMPILATION_ERROR"
                        : "RUNTIME_ERROR";

                return ExecutionResult.builder()

                        .success(false)

                        .status(executionStatus)

                        .output(output)

                        .errorMessage(error)

                        .executionTime(executionTime)

                        .memoryUsed(null)

                        .testCasesPassed(0)

                        .totalTestCases(1)

                        .build();
            }

            // =====================================================
            // COMPARE OUTPUT
            // =====================================================

            boolean compareOutput = expectedOutput != null;
            boolean correct = !compareOutput || outputComparator.compare(output, expectedOutput);

            // =====================================================
            // FINAL RESULT
            // =====================================================

            return ExecutionResult.builder()

                    .success(correct)

                    .status(
                            correct
                                    ? (compareOutput ? "ACCEPTED" : "COMPLETED")
                                    : "WRONG_ANSWER"
                    )

                    .output(output)

                    .errorMessage(null)

                    .executionTime(executionTime)

                    .memoryUsed(null)

                    .testCasesPassed(
                            correct ? 1 : 0
                    )

                    .totalTestCases(1)

                    .build();

        } catch (Exception e) {
            String message = dockerUnavailableMessage(e.getMessage());

            return ExecutionResult.builder()

                    .success(false)

                    .status("EXECUTION_ERROR")

                    .output(null)

                    .errorMessage(message == null ? e.getMessage() : message)

                    .executionTime(
                            System.currentTimeMillis()
                                    - startTime
                    )

                    .memoryUsed(null)

                    .testCasesPassed(0)

                    .totalTestCases(1)

                    .build();
        }
    }

    private String dockerUnavailableMessage(String message) {
        if (message == null) return null;
        String normalized = message.toLowerCase();
        if (normalized.contains("failed to connect to the docker api")
                || normalized.contains("cannot connect to the docker daemon")
                || normalized.contains("is the docker daemon running")) {
            return "Docker Desktop engine is not running. Open Docker Desktop, wait until it shows Engine running, then run your code again.";
        }
        return null;
    }

    private boolean isCompilationError(String language, String error) {
        if (error == null) return false;
        String normalized = error.toLowerCase();
        String normalizedLanguage = language == null ? "" : language.toUpperCase();
        if ("JAVA".equals(normalizedLanguage) || "CPP".equals(normalizedLanguage)
                || "C++".equals(normalizedLanguage)) {
            return normalized.contains("error:")
                    || normalized.contains("compilation terminated");
        }
        if ("PYTHON".equals(normalizedLanguage)) {
            return normalized.contains("syntaxerror")
                    || normalized.contains("indentationerror");
        }
        if ("JAVASCRIPT".equals(normalizedLanguage) || "JS".equals(normalizedLanguage)) {
            return normalized.contains("syntaxerror");
        }
        return false;
    }

    // =========================================================
    // DOCKER IMAGE
    // =========================================================

    private String getDockerImage(String language) {

        return switch (language.toUpperCase()) {

            case "JAVA" ->
                    "eclipse-temurin:21-jdk";

            case "PYTHON" ->
                    "python:3.12-slim";

            case "CPP", "C++" ->
                    "gcc:latest";

            case "JAVASCRIPT", "JS" ->
                    "node:22-alpine";

            default ->
                    throw new IllegalArgumentException(
                            "Unsupported programming language: "
                                    + language
                    );
        };
    }

    // =========================================================
    // DOCKER COMMAND
    // =========================================================

    private String getCommand(
            String language,
            String sourceCode) {

        /*
         * Source code ko Base64 me encode kar rahe hain.
         *
         * Isse source code aur stdin input mix nahi honge.
         */

        String encodedSource =
                Base64.getEncoder()
                        .encodeToString(
                                sourceCode.getBytes(
                                        StandardCharsets.UTF_8
                                )
                        );

        return switch (language.toUpperCase()) {

            // =================================================
            // JAVA
            // =================================================

            case "JAVA" ->

                    "echo "
                            + encodedSource
                            + " | base64 -d > Main.java "
                            + "&& javac Main.java "
                            + "&& java Main";

            // =================================================
            // PYTHON
            // =================================================

            case "PYTHON" ->

                    "echo "
                            + encodedSource
                            + " | base64 -d > main.py "
                            + "&& python3 main.py";

            // =================================================
            // C++
            // =================================================

            case "CPP", "C++" ->

                    "echo "
                            + encodedSource
                            + " | base64 -d > main.cpp "
                            + "&& g++ main.cpp -o main "
                            + "&& ./main";

            // =================================================
            // JAVASCRIPT
            // =================================================

            case "JAVASCRIPT", "JS" ->

                    "echo "
                            + encodedSource
                            + " | base64 -d > main.js "
                            + "&& node main.js";

            default ->

                    throw new IllegalArgumentException(
                            "Unsupported programming language: "
                                    + language
                    );
        };
    }

    // =========================================================
    // READ STREAM
    // =========================================================

    private String readStream(
            InputStream inputStream)
            throws Exception {

        StringBuilder result =
                new StringBuilder();

        try (BufferedReader reader =
                     new BufferedReader(
                             new InputStreamReader(
                                     inputStream,
                                     StandardCharsets.UTF_8
                             ))) {

            String line;

            while ((line = reader.readLine()) != null) {

                result.append(line)
                        .append(System.lineSeparator());
            }
        }

        return result.toString().trim();
    }

    private String readStreamSafely(InputStream inputStream) {
        try {
            return readStream(inputStream);
        } catch (Exception exception) {
            return exception.getMessage() == null ? "" : exception.getMessage();
        }
    }
}
