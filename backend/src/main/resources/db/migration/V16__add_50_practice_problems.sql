-- Use short TODO templates for the existing seeded examples too.
UPDATE problems
SET starter_code_java = $java$import java.util.*;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    // TODO: read input and print the required output
  }
}$java$,
    starter_code_python = $python$# Read input and print the required output$python$,
    starter_code_cpp = $cpp$#include <bits/stdc++.h>
using namespace std;
int main() {
  // TODO: read input and print the required output
  return 0;
}
$cpp$,
    starter_code_javascript = $javascript$const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();
// TODO: read input and print the required output$javascript$
WHERE slug IN ('sum-two-numbers', 'maximum-of-three', 'reverse-string', 'factorial-number', 'count-vowels')
   OR lower(title) LIKE '%palindrome%';

WITH seed (slug, title, description, sample_input, sample_output, category, difficulty, points) AS (VALUES
('practice-subtract-two', 'Difference of Two Numbers', 'Read integers a and b and print a minus b.', '9 4', '5', 'Math', 'EASY', 100),
('practice-multiply-two', 'Product of Two Numbers', 'Read two integers and print their product.', '3 4', '12', 'Math', 'EASY', 100),
('practice-integer-quotient', 'Integer Quotient', 'Read non-negative a and positive b. Print the integer quotient a divided by b.', '17 5', '3', 'Math', 'EASY', 100),
('practice-even-odd', 'Even or Odd', 'Read one integer. Print EVEN when it is divisible by 2, otherwise print ODD.', '8', 'EVEN', 'Math', 'EASY', 100),
('practice-number-sign', 'Number Sign', 'Read an integer and print POSITIVE, NEGATIVE, or ZERO.', '-9', 'NEGATIVE', 'Math', 'EASY', 100),
('practice-min-two', 'Minimum of Two Numbers', 'Read two integers and print the smaller value.', '4 8', '4', 'Math', 'EASY', 100),
('practice-min-three', 'Minimum of Three Numbers', 'Read three integers and print the smallest value.', '4 8 2', '2', 'Math', 'EASY', 100),
('practice-leap-year', 'Leap Year', 'Read a year. Print true if it is a Gregorian leap year, otherwise print false. A year is leap when divisible by 400, or divisible by 4 but not by 100.', '2000', 'true', 'Math', 'EASY', 100),
('practice-divisible-five', 'Divisible by Five', 'Read an integer and print true if it is divisible by 5, otherwise print false.', '25', 'true', 'Math', 'EASY', 100),
('practice-sum-to-n', 'Sum from One to N', 'Read a non-negative integer n and print the sum of all integers from 1 through n.', '5', '15', 'Math', 'EASY', 100),
('practice-fibonacci-nth', 'Nth Fibonacci Number', 'Read n and print F(n), where F(0)=0, F(1)=1, and each later term is the sum of the previous two. 0 <= n <= 45.', '7', '13', 'Math', 'EASY', 100),
('practice-count-digits', 'Count Digits', 'Read a non-negative integer and print its number of decimal digits. Zero has one digit.', '5082', '4', 'Math', 'EASY', 100),
('practice-sum-digits', 'Sum of Digits', 'Read a non-negative integer and print the sum of its decimal digits.', '1234', '10', 'Math', 'EASY', 100),
('practice-reverse-integer', 'Reverse a Non-negative Integer', 'Read a non-negative integer and print its digits in reverse order. Leading zeroes in the result are omitted.', '1200', '21', 'Math', 'EASY', 100),
('practice-prime-check', 'Prime Check', 'Read an integer n and print true if n is prime, otherwise print false. Numbers less than 2 are not prime.', '7', 'true', 'Math', 'EASY', 100),
('practice-count-primes', 'Count Primes up to N', 'Read n and print how many prime numbers are in the inclusive range from 2 to n. 0 <= n <= 1000.', '10', '4', 'Math', 'MEDIUM', 150),
('practice-gcd', 'Greatest Common Divisor', 'Read two positive integers and print their greatest common divisor.', '18 24', '6', 'Math', 'EASY', 100),
('practice-lcm', 'Least Common Multiple', 'Read two positive integers and print their least common multiple.', '4 6', '12', 'Math', 'EASY', 100),
('practice-integer-power', 'Integer Power', 'Read integers a and b, where 0 <= b <= 10, and print a raised to power b.', '2 5', '32', 'Math', 'EASY', 100),
('practice-perfect-number', 'Perfect Number', 'Read a positive integer and print true if it equals the sum of its positive proper divisors, otherwise print false.', '6', 'true', 'Math', 'MEDIUM', 150),
('practice-armstrong-three', 'Three-digit Armstrong Number', 'Read a three-digit integer and print true if it equals the sum of the cubes of its digits, otherwise print false.', '153', 'true', 'Math', 'EASY', 100),
('practice-decimal-binary', 'Decimal to Binary', 'Read a non-negative integer and print its binary representation without leading zeroes. Print 0 for zero.', '10', '1010', 'Math', 'EASY', 100),
('practice-binary-decimal', 'Binary to Decimal', 'Read a string containing binary digits and print its decimal value.', '1011', '11', 'Math', 'EASY', 100),
('practice-string-palindrome', 'Palindrome String', 'Read one word and print true if it reads the same forward and backward, otherwise print false. Comparison is case-sensitive.', 'level', 'true', 'Strings', 'EASY', 100),
('practice-vowel-check', 'Vowel Check', 'Read one English letter and print true if it is a vowel, otherwise print false. Treat uppercase and lowercase vowels the same.', 'B', 'false', 'Strings', 'EASY', 100),
('practice-string-length', 'String Length', 'Read one word and print the number of characters in it.', 'hello', '5', 'Strings', 'EASY', 100),
('practice-uppercase-lowercase', 'Convert to Lowercase', 'Read one word and print it in lowercase.', 'HELLO', 'hello', 'Strings', 'EASY', 100),
('practice-lowercase-uppercase', 'Convert to Uppercase', 'Read one word and print it in uppercase.', 'hello', 'HELLO', 'Strings', 'EASY', 100),
('practice-remove-vowels', 'Remove Vowels', 'Read one word and print it after removing every a, e, i, o, and u. Treat uppercase and lowercase vowels the same.', 'hello', 'hll', 'Strings', 'EASY', 100),
('practice-count-character', 'Count a Character', 'Read a word and a single character. Print how many times that character occurs in the word. Comparison is case-sensitive.', 'banana a', '3', 'Strings', 'EASY', 100),
('practice-array-sum', 'Array Sum', 'Read n followed by n integers. Print their sum.', '5 1 2 3 4 5', '15', 'Arrays', 'EASY', 100),
('practice-array-maximum', 'Array Maximum', 'Read n followed by n integers. Print the largest value.', '4 -1 7 2 4', '7', 'Arrays', 'EASY', 100),
('practice-array-minimum', 'Array Minimum', 'Read n followed by n integers. Print the smallest value.', '4 -1 7 2 4', '-1', 'Arrays', 'EASY', 100),
('practice-second-largest', 'Second Largest Distinct Value', 'Read n followed by n integers and print the second largest distinct value. The input always contains at least two distinct values.', '5 4 1 5 2 3', '4', 'Arrays', 'MEDIUM', 150),
('practice-reverse-array', 'Reverse an Array', 'Read n followed by n integers. Print the values in reverse order, separated by one space.', '4 1 2 3 4', '4 3 2 1', 'Arrays', 'EASY', 100),
('practice-linear-search', 'Linear Search Index', 'Read n, n integers, then a target. Print the target first index (zero-based), or -1 if absent.', '5 2 4 6 8 10 8', '3', 'Arrays', 'EASY', 100),
('practice-count-occurrences', 'Count Target Occurrences', 'Read n, n integers, then a target. Print how many array values equal the target.', '5 1 2 1 3 1 1', '3', 'Arrays', 'EASY', 100),
('practice-sorted-check', 'Check Sorted Array', 'Read n followed by n integers. Print true if they are in non-decreasing order, otherwise print false.', '4 1 2 2 5', 'true', 'Arrays', 'EASY', 100),
('practice-deduplicate-sorted', 'Deduplicate a Sorted Array', 'Read n followed by n non-decreasing integers. Print each distinct value once, in order, separated by spaces.', '7 1 1 2 2 2 4 4', '1 2 4', 'Arrays', 'EASY', 100),
('practice-left-rotate', 'Left Rotate an Array', 'Read n, n integers, and k. Rotate the array left by k positions (k may exceed n), then print the values separated by spaces.', '5 1 2 3 4 5 2', '3 4 5 1 2', 'Arrays', 'MEDIUM', 150),
('practice-missing-number', 'Missing Number from One to N', 'Read n followed by n-1 distinct values from 1 through n. Print the missing value.', '5 1 2 4 5', '3', 'Arrays', 'EASY', 100),
('practice-count-even-array', 'Count Even Array Values', 'Read n followed by n integers. Print how many values are even.', '4 1 2 4 5', '2', 'Arrays', 'EASY', 100),
('practice-pair-sum', 'Pair Sum Exists', 'Read n, n integers, and a target. Print true if two different array positions sum to the target, otherwise print false.', '4 1 2 3 4 7', 'true', 'Arrays', 'MEDIUM', 150),
('practice-sort-three', 'Sort Three Numbers', 'Read three integers and print them in non-decreasing order, separated by spaces.', '3 1 2', '1 2 3', 'Sorting', 'EASY', 100),
('practice-diagonal-sum', 'Square Matrix Diagonal Sum', 'Read n followed by an n by n matrix in row-major order. Print the sum of its main diagonal.', '3 1 0 0 0 5 0 0 0 7', '13', 'Matrices', 'EASY', 100),
('practice-transpose-two', 'Transpose a 2 by 2 Matrix', 'Read four integers for a 2 by 2 matrix in row-major order. Print the transposed matrix in row-major order, separated by spaces.', '1 2 3 4', '1 3 2 4', 'Matrices', 'EASY', 100),
('practice-add-two-matrices', 'Add Two 2 by 2 Matrices', 'Read four values for each of two 2 by 2 matrices in row-major order. Print their sum in row-major order, separated by spaces.', '1 2 3 4 5 6 7 8', '6 8 10 12', 'Matrices', 'EASY', 100),
('practice-count-words', 'Count Words', 'Read a line of words separated by spaces and print the number of words. There are no leading or trailing spaces.', 'hello world', '2', 'Strings', 'EASY', 100),
('practice-longest-word', 'Longest Word Length', 'Read a line of words separated by spaces and print the length of the longest word.', 'red blue green', '5', 'Strings', 'EASY', 100),
('practice-count-positive', 'Count Positive Array Values', 'Read n followed by n integers. Print how many values are greater than zero.', '5 -1 0 2 3 -5', '2', 'Arrays', 'EASY', 100)
)
INSERT INTO problems (
    title, slug, description, input_format, output_format, constraints,
    sample_input, sample_output, difficulty, category, time_limit, memory_limit,
    points, starter_code_java, starter_code_python, starter_code_cpp,
    starter_code_javascript, editorial_unlock_attempts, created_by,
    is_active, created_at, updated_at
)
SELECT seed.title, seed.slug, seed.description,
       'Read the input values described above from standard input. Values are whitespace-separated unless the statement specifies a full line.',
       'Print only the requested result. Do not print prompts or labels.',
       'Follow the ranges and input shape in the description.',
       seed.sample_input, seed.sample_output, seed.difficulty, seed.category,
       1000, 256, seed.points,
       $java$import java.util.*;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    // TODO: read input and print the required output
  }
}$java$,
       $python$# Read input and print the required output$python$,
       $cpp$#include <bits/stdc++.h>
using namespace std;
int main() {
  // TODO: read input and print the required output
  return 0;
}
$cpp$,
       $javascript$const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();
// TODO: read input and print the required output$javascript$,
       3, admin.id, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM seed
CROSS JOIN (SELECT id FROM users WHERE role = 'ADMIN' ORDER BY id LIMIT 1) AS admin
WHERE TRUE
ON CONFLICT (slug) DO NOTHING;

WITH cases (slug, input_data, expected_output, is_sample, is_hidden) AS (VALUES
('practice-subtract-two', '9 4', '5', TRUE, FALSE), ('practice-subtract-two', '-3 7', '-10', FALSE, FALSE), ('practice-subtract-two', '5 9', '-4', FALSE, TRUE),
('practice-multiply-two', '3 4', '12', TRUE, FALSE), ('practice-multiply-two', '-2 5', '-10', FALSE, FALSE), ('practice-multiply-two', '0 99', '0', FALSE, TRUE),
('practice-integer-quotient', '17 5', '3', TRUE, FALSE), ('practice-integer-quotient', '20 4', '5', FALSE, FALSE), ('practice-integer-quotient', '9 2', '4', FALSE, TRUE),
('practice-even-odd', '8', 'EVEN', TRUE, FALSE), ('practice-even-odd', '7', 'ODD', FALSE, FALSE), ('practice-even-odd', '0', 'EVEN', FALSE, TRUE),
('practice-number-sign', '-9', 'NEGATIVE', TRUE, FALSE), ('practice-number-sign', '4', 'POSITIVE', FALSE, FALSE), ('practice-number-sign', '0', 'ZERO', FALSE, TRUE),
('practice-min-two', '4 8', '4', TRUE, FALSE), ('practice-min-two', '-5 -2', '-5', FALSE, FALSE), ('practice-min-two', '3 3', '3', FALSE, TRUE),
('practice-min-three', '4 8 2', '2', TRUE, FALSE), ('practice-min-three', '-3 -9 -1', '-9', FALSE, FALSE), ('practice-min-three', '5 5 5', '5', FALSE, TRUE),
('practice-leap-year', '2000', 'true', TRUE, FALSE), ('practice-leap-year', '1900', 'false', FALSE, FALSE), ('practice-leap-year', '2024', 'true', FALSE, TRUE),
('practice-divisible-five', '25', 'true', TRUE, FALSE), ('practice-divisible-five', '17', 'false', FALSE, FALSE), ('practice-divisible-five', '0', 'true', FALSE, TRUE),
('practice-sum-to-n', '5', '15', TRUE, FALSE), ('practice-sum-to-n', '1', '1', FALSE, FALSE), ('practice-sum-to-n', '0', '0', FALSE, TRUE),
('practice-fibonacci-nth', '7', '13', TRUE, FALSE), ('practice-fibonacci-nth', '0', '0', FALSE, FALSE), ('practice-fibonacci-nth', '10', '55', FALSE, TRUE),
('practice-count-digits', '5082', '4', TRUE, FALSE), ('practice-count-digits', '0', '1', FALSE, FALSE), ('practice-count-digits', '900', '3', FALSE, TRUE),
('practice-sum-digits', '1234', '10', TRUE, FALSE), ('practice-sum-digits', '0', '0', FALSE, FALSE), ('practice-sum-digits', '905', '14', FALSE, TRUE),
('practice-reverse-integer', '1200', '21', TRUE, FALSE), ('practice-reverse-integer', '1234', '4321', FALSE, FALSE), ('practice-reverse-integer', '0', '0', FALSE, TRUE),
('practice-prime-check', '7', 'true', TRUE, FALSE), ('practice-prime-check', '1', 'false', FALSE, FALSE), ('practice-prime-check', '2', 'true', FALSE, TRUE),
('practice-count-primes', '10', '4', TRUE, FALSE), ('practice-count-primes', '1', '0', FALSE, FALSE), ('practice-count-primes', '20', '8', FALSE, TRUE),
('practice-gcd', '18 24', '6', TRUE, FALSE), ('practice-gcd', '7 13', '1', FALSE, FALSE), ('practice-gcd', '100 10', '10', FALSE, TRUE),
('practice-lcm', '4 6', '12', TRUE, FALSE), ('practice-lcm', '7 3', '21', FALSE, FALSE), ('practice-lcm', '5 5', '5', FALSE, TRUE),
('practice-integer-power', '2 5', '32', TRUE, FALSE), ('practice-integer-power', '3 0', '1', FALSE, FALSE), ('practice-integer-power', '5 3', '125', FALSE, TRUE),
('practice-perfect-number', '6', 'true', TRUE, FALSE), ('practice-perfect-number', '28', 'true', FALSE, FALSE), ('practice-perfect-number', '12', 'false', FALSE, TRUE),
('practice-armstrong-three', '153', 'true', TRUE, FALSE), ('practice-armstrong-three', '370', 'true', FALSE, FALSE), ('practice-armstrong-three', '123', 'false', FALSE, TRUE),
('practice-decimal-binary', '10', '1010', TRUE, FALSE), ('practice-decimal-binary', '0', '0', FALSE, FALSE), ('practice-decimal-binary', '31', '11111', FALSE, TRUE),
('practice-binary-decimal', '1011', '11', TRUE, FALSE), ('practice-binary-decimal', '0', '0', FALSE, FALSE), ('practice-binary-decimal', '111111', '63', FALSE, TRUE),
('practice-string-palindrome', 'level', 'true', TRUE, FALSE), ('practice-string-palindrome', 'Code', 'false', FALSE, FALSE), ('practice-string-palindrome', 'a', 'true', FALSE, TRUE),
('practice-vowel-check', 'B', 'false', TRUE, FALSE), ('practice-vowel-check', 'a', 'true', FALSE, FALSE), ('practice-vowel-check', 'E', 'true', FALSE, TRUE),
('practice-string-length', 'hello', '5', TRUE, FALSE), ('practice-string-length', 'CodeArena', '9', FALSE, FALSE), ('practice-string-length', 'x', '1', FALSE, TRUE),
('practice-uppercase-lowercase', 'HELLO', 'hello', TRUE, FALSE), ('practice-uppercase-lowercase', 'PyThOn', 'python', FALSE, FALSE), ('practice-uppercase-lowercase', 'CODE', 'code', FALSE, TRUE),
('practice-lowercase-uppercase', 'hello', 'HELLO', TRUE, FALSE), ('practice-lowercase-uppercase', 'coDe', 'CODE', FALSE, FALSE), ('practice-lowercase-uppercase', 'a', 'A', FALSE, TRUE),
('practice-remove-vowels', 'hello', 'hll', TRUE, FALSE), ('practice-remove-vowels', 'banana', 'bnn', FALSE, FALSE), ('practice-remove-vowels', 'xyz', 'xyz', FALSE, TRUE),
('practice-count-character', 'banana a', '3', TRUE, FALSE), ('practice-count-character', 'hello l', '2', FALSE, FALSE), ('practice-count-character', 'xyz a', '0', FALSE, TRUE),
('practice-array-sum', '5 1 2 3 4 5', '15', TRUE, FALSE), ('practice-array-sum', '1 -4', '-4', FALSE, FALSE), ('practice-array-sum', '4 0 0 0 0', '0', FALSE, TRUE),
('practice-array-maximum', '4 -1 7 2 4', '7', TRUE, FALSE), ('practice-array-maximum', '1 -8', '-8', FALSE, FALSE), ('practice-array-maximum', '3 -5 -2 -9', '-2', FALSE, TRUE),
('practice-array-minimum', '4 -1 7 2 4', '-1', TRUE, FALSE), ('practice-array-minimum', '1 -8', '-8', FALSE, FALSE), ('practice-array-minimum', '3 -5 -2 -9', '-9', FALSE, TRUE),
('practice-second-largest', '5 4 1 5 2 3', '4', TRUE, FALSE), ('practice-second-largest', '4 7 7 3 1', '3', FALSE, FALSE), ('practice-second-largest', '3 -1 -5 -3', '-3', FALSE, TRUE),
('practice-reverse-array', '4 1 2 3 4', '4 3 2 1', TRUE, FALSE), ('practice-reverse-array', '1 9', '9', FALSE, FALSE), ('practice-reverse-array', '3 -1 0 5', '5 0 -1', FALSE, TRUE),
('practice-linear-search', '5 2 4 6 8 10 8', '3', TRUE, FALSE), ('practice-linear-search', '4 1 2 3 4 7', '-1', FALSE, FALSE), ('practice-linear-search', '3 5 5 5 5', '0', FALSE, TRUE),
('practice-count-occurrences', '5 1 2 1 3 1 1', '3', TRUE, FALSE), ('practice-count-occurrences', '4 2 2 2 2 3', '0', FALSE, FALSE), ('practice-count-occurrences', '1 9 9', '1', FALSE, TRUE),
('practice-sorted-check', '4 1 2 2 5', 'true', TRUE, FALSE), ('practice-sorted-check', '3 3 2 1', 'false', FALSE, FALSE), ('practice-sorted-check', '3 5 5 5', 'true', FALSE, TRUE),
('practice-deduplicate-sorted', '7 1 1 2 2 2 4 4', '1 2 4', TRUE, FALSE), ('practice-deduplicate-sorted', '5 1 1 1 2 2', '1 2', FALSE, FALSE), ('practice-deduplicate-sorted', '4 1 2 3 4', '1 2 3 4', FALSE, TRUE),
('practice-left-rotate', '5 1 2 3 4 5 2', '3 4 5 1 2', TRUE, FALSE), ('practice-left-rotate', '3 7 8 9 0', '7 8 9', FALSE, FALSE), ('practice-left-rotate', '4 1 2 3 4 4', '1 2 3 4', FALSE, TRUE),
('practice-missing-number', '5 1 2 4 5', '3', TRUE, FALSE), ('practice-missing-number', '2 2', '1', FALSE, FALSE), ('practice-missing-number', '3 1 2', '3', FALSE, TRUE),
('practice-count-even-array', '4 1 2 4 5', '2', TRUE, FALSE), ('practice-count-even-array', '3 1 3 5', '0', FALSE, FALSE), ('practice-count-even-array', '1 0', '1', FALSE, TRUE),
('practice-pair-sum', '4 1 2 3 4 7', 'true', TRUE, FALSE), ('practice-pair-sum', '3 1 2 3 10', 'false', FALSE, FALSE), ('practice-pair-sum', '4 5 5 1 9 10', 'true', FALSE, TRUE),
('practice-sort-three', '3 1 2', '1 2 3', TRUE, FALSE), ('practice-sort-three', '-2 0 -1', '-2 -1 0', FALSE, FALSE), ('practice-sort-three', '5 5 1', '1 5 5', FALSE, TRUE),
('practice-diagonal-sum', '3 1 0 0 0 5 0 0 0 7', '13', TRUE, FALSE), ('practice-diagonal-sum', '1 9', '9', FALSE, FALSE), ('practice-diagonal-sum', '2 1 2 3 4', '5', FALSE, TRUE),
('practice-transpose-two', '1 2 3 4', '1 3 2 4', TRUE, FALSE), ('practice-transpose-two', '1 0 0 1', '1 0 0 1', FALSE, FALSE), ('practice-transpose-two', '-1 2 5 3', '-1 5 2 3', FALSE, TRUE),
('practice-add-two-matrices', '1 2 3 4 5 6 7 8', '6 8 10 12', TRUE, FALSE), ('practice-add-two-matrices', '0 0 0 0 1 2 3 4', '1 2 3 4', FALSE, FALSE), ('practice-add-two-matrices', '-1 2 5 3 1 1 0 -3', '0 3 5 0', FALSE, TRUE),
('practice-count-words', 'hello world', '2', TRUE, FALSE), ('practice-count-words', 'one', '1', FALSE, FALSE), ('practice-count-words', 'a b c d', '4', FALSE, TRUE),
('practice-longest-word', 'red blue green', '5', TRUE, FALSE), ('practice-longest-word', 'a bb ccc', '3', FALSE, FALSE), ('practice-longest-word', 'codearena practice', '9', FALSE, TRUE),
('practice-count-positive', '5 -1 0 2 3 -5', '2', TRUE, FALSE), ('practice-count-positive', '3 -3 -2 -1', '0', FALSE, FALSE), ('practice-count-positive', '1 8', '1', FALSE, TRUE)
)
INSERT INTO test_cases (problem_id, input_data, expected_output, is_sample, is_hidden)
SELECT problem.id, cases.input_data, cases.expected_output, cases.is_sample, cases.is_hidden
FROM cases
JOIN problems AS problem ON problem.slug = cases.slug
WHERE NOT EXISTS (
    SELECT 1 FROM test_cases AS existing
    WHERE existing.problem_id = problem.id
      AND existing.input_data = cases.input_data
);
