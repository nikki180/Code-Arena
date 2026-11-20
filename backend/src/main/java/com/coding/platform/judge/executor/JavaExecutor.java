package com.coding.platform.judge.executor;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

import com.coding.platform.judge.dto.ExecutionResult;

@Component
public class JavaExecutor {

    private static final long TIMEOUT_SECONDS = 5;

    public ExecutionResult execute(
            String sourceCode,
            String input) {

        long startTime = System.currentTimeMillis();

        Path tempDirectory = null;

        try {

            tempDirectory =
                    Files.createTempDirectory("codearena-java-");

            Path javaFile =
                    tempDirectory.resolve("Main.java");

            /*
             * The submitted Java program must contain:
             *
             * public class Main
             *
             * so that javac can compile Main.java.
             */

            Files.writeString(
                    javaFile,
                    sourceCode,
                    StandardCharsets.UTF_8
            );

            // =================================================
            // COMPILE
            // =================================================

            ProcessBuilder compileBuilder =
                    new ProcessBuilder(
                            "javac",
                            javaFile.toString()
                    );

            compileBuilder.directory(
                    tempDirectory.toFile()
            );

            compileBuilder.redirectErrorStream(true);

            Process compileProcess =
                    compileBuilder.start();

            String compileOutput =
                    readProcessOutput(
                            compileProcess
                    );

            boolean compiled =
                    compileProcess.waitFor(
                            TIMEOUT_SECONDS,
                            TimeUnit.SECONDS
                    );

            if (!compiled) {

                compileProcess.destroyForcibly();

                return ExecutionResult.builder()
                        .success(false)
                        .output("")
                        .error(
                                "Compilation timed out."
                        )
                        .executionTime(
                                System.currentTimeMillis()
                                        - startTime
                        )
                        .build();
            }

            if (compileProcess.exitValue() != 0) {

                return ExecutionResult.builder()
                        .success(false)
                        .output("")
                        .error(
                                compileOutput
                        )
                        .executionTime(
                                System.currentTimeMillis()
                                        - startTime
                        )
                        .build();
            }

            // =================================================
            // RUN
            // =================================================

            ProcessBuilder runBuilder =
                    new ProcessBuilder(
                            "java",
                            "-cp",
                            tempDirectory.toString(),
                            "Main"
                    );

            runBuilder.directory(
                    tempDirectory.toFile()
            );

            runBuilder.redirectErrorStream(true);

            Process runProcess =
                    runBuilder.start();

            // =================================================
            // SEND INPUT
            // =================================================

            if (input != null) {

                try (OutputStream outputStream =
                             runProcess.getOutputStream()) {

                    outputStream.write(
                            input.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

                    outputStream.flush();
                }
            }

            // =================================================
            // TIMEOUT
            // =================================================

            boolean finished =
                    runProcess.waitFor(
                            TIMEOUT_SECONDS,
                            TimeUnit.SECONDS
                    );

            if (!finished) {

                runProcess.destroyForcibly();

                return ExecutionResult.builder()
                        .success(false)
                        .output("")
                        .error(
                                "Execution timed out."
                        )
                        .executionTime(
                                System.currentTimeMillis()
                                        - startTime
                        )
                        .build();
            }

            String output =
                    readProcessOutput(
                            runProcess
                    );

            // =================================================
            // EXECUTION ERROR
            // =================================================

            if (runProcess.exitValue() != 0) {

                return ExecutionResult.builder()
                        .success(false)
                        .output(output)
                        .error(output)
                        .executionTime(
                                System.currentTimeMillis()
                                        - startTime
                        )
                        .build();
            }

            // =================================================
            // SUCCESS
            // =================================================

            return ExecutionResult.builder()
                    .success(true)
                    .output(
                            normalizeOutput(output)
                    )
                    .error(null)
                    .executionTime(
                            System.currentTimeMillis()
                                    - startTime
                    )
                    .build();

        } catch (Exception e) {

            return ExecutionResult.builder()
                    .success(false)
                    .output("")
                    .error(
                            e.getMessage() != null
                                    ? e.getMessage()
                                    : e.getClass()
                                            .getSimpleName()
                    )
                    .executionTime(
                            System.currentTimeMillis()
                                    - startTime
                    )
                    .build();

        } finally {

            deleteDirectory(
                    tempDirectory
            );
        }
    }

    // =========================================================
    // READ PROCESS OUTPUT
    // =========================================================

    private String readProcessOutput(
            Process process) {

        StringBuilder output =
                new StringBuilder();

        try {

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    process.getInputStream(),
                                    StandardCharsets.UTF_8
                            )
                    );

            String line;

            while ((line = reader.readLine()) != null) {

                output.append(line)
                        .append(System.lineSeparator());
            }

        } catch (Exception e) {

            return e.getMessage() != null
                    ? e.getMessage()
                    : "";
        }

        return output.toString();
    }

    // =========================================================
    // NORMALIZE OUTPUT
    // =========================================================

    private String normalizeOutput(
            String output) {

        if (output == null) {
            return "";
        }

        return output
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .trim();
    }

    // =========================================================
    // DELETE TEMP DIRECTORY
    // =========================================================

    private void deleteDirectory(
            Path directory) {

        if (directory == null) {
            return;
        }

        try {

            Files.walk(directory)
                    .sorted(
                            (a, b) ->
                                    b.compareTo(a)
                    )
                    .map(Path::toFile)
                    .forEach(File::delete);

        } catch (Exception ignored) {
            // Cleanup failure should not break the response.
        }
    }
}