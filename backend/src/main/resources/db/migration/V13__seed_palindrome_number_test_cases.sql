-- Seed a stdin-based starter and visible cases for the existing problem.
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
WHERE lower(slug) = 'palindrome-number'
   OR lower(title) = 'palindrome number';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_sample, is_hidden)
SELECT problem.id, cases.input_data, cases.expected_output, cases.is_sample, FALSE
FROM problems AS problem
CROSS JOIN (VALUES
    ('121', 'true', TRUE),
    ('-121', 'false', FALSE),
    ('10', 'false', FALSE),
    ('0', 'true', FALSE)
) AS cases(input_data, expected_output, is_sample)
WHERE (lower(problem.slug) = 'palindrome-number'
   OR lower(problem.title) = 'palindrome number')
  AND NOT EXISTS (
      SELECT 1
      FROM test_cases AS existing
      WHERE existing.problem_id = problem.id
        AND existing.input_data = cases.input_data
  );
