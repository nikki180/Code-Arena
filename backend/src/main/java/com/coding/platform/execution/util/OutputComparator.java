package com.coding.platform.execution.util;

import org.springframework.stereotype.Component;

@Component
public class OutputComparator {

    public boolean compare(
            String actualOutput,
            String expectedOutput) {

        if (actualOutput == null ||
                expectedOutput == null) {

            return false;
        }

        String actual =
                normalize(actualOutput);

        String expected =
                normalize(expectedOutput);

        return actual.equals(expected);
    }

    private String normalize(String output) {

        return output
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .trim();
    }
}