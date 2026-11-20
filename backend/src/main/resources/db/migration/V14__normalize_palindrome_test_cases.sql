-- Match title as well as slug to handle legacy admin-created problem slugs.
UPDATE problems
SET sample_input = '121',
    sample_output = 'true',
    starter_code_java = 'import java.util.*; public class Main { public static void main(String[] args) { Scanner scanner = new Scanner(System.in); String value = scanner.next().trim(); System.out.println(value.equals(new StringBuilder(value).reverse().toString())); } }',
    starter_code_python = 'value = input().strip(); print(str(value == value[::-1]).lower())',
    starter_code_cpp = $cpp$#include <bits/stdc++.h>
using namespace std;
int main() { string value; cin >> value; string reversed = value; reverse(reversed.begin(), reversed.end()); cout << (value == reversed ? "true" : "false") << endl; }
$cpp$,
    starter_code_javascript = 'const fs = require("fs"); const value = fs.readFileSync(0, "utf8").trim(); console.log(String(value === [...value].reverse().join("")));',
    updated_at = CURRENT_TIMESTAMP
WHERE lower(title) LIKE '%palindrome%'
   OR lower(slug) LIKE '%palindrome%';

UPDATE test_cases AS existing
SET expected_output = CASE existing.input_data
        WHEN '121' THEN 'true'
        WHEN '-121' THEN 'false'
        WHEN '10' THEN 'false'
        WHEN '0' THEN 'true'
    END,
    is_sample = (existing.input_data = '121'),
    is_hidden = FALSE
FROM problems AS problem
WHERE existing.problem_id = problem.id
  AND (lower(problem.title) LIKE '%palindrome%' OR lower(problem.slug) LIKE '%palindrome%')
  AND existing.input_data IN ('121', '-121', '10', '0');

INSERT INTO test_cases (problem_id, input_data, expected_output, is_sample, is_hidden)
SELECT problem.id, cases.input_data, cases.expected_output, cases.is_sample, FALSE
FROM problems AS problem
CROSS JOIN (VALUES
    ('121', 'true', TRUE),
    ('-121', 'false', FALSE),
    ('10', 'false', FALSE),
    ('0', 'true', FALSE)
) AS cases(input_data, expected_output, is_sample)
WHERE (lower(problem.title) LIKE '%palindrome%' OR lower(problem.slug) LIKE '%palindrome%')
  AND NOT EXISTS (
      SELECT 1 FROM test_cases AS existing
      WHERE existing.problem_id = problem.id
        AND existing.input_data = cases.input_data
  );
