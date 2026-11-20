-- Seed five reusable practice problems. Flyway runs this once per database.
WITH problem_seed (
    slug, title, description, input_format, output_format, constraints,
    sample_input, sample_output, explanation, difficulty, category,
    time_limit, memory_limit, points, starter_code_java,
    starter_code_python, starter_code_cpp, starter_code_javascript,
    editorial, hints
) AS (VALUES
    (
        'sum-two-numbers', 'Sum of Two Numbers',
        'Read two integers and print their sum.',
        'Two integers a and b separated by whitespace.',
        'Print a + b.', 'Values fit in a signed 64-bit integer.',
        '4 7', '11', 'Add both input values and print the result.', 'EASY', 'Math', 1000, 256, 100,
        $java1$import java.util.Scanner; public class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); long a = sc.nextLong(); long b = sc.nextLong(); System.out.println(a + b); } }$java1$,
        $py1$a, b = map(int, input().split()); print(a + b)$py1$,
        $cpp1$#include <bits/stdc++.h>
using namespace std;
int main() { long long a, b; cin >> a >> b; cout << a + b << endl; }
$cpp1$,
        $js1$const fs = require('fs'); const [a, b] = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number); console.log(a + b);$js1$,
        'Read two numbers and add them.', 'Use long long / long for large values.'
    ),
    (
        'maximum-of-three', 'Maximum of Three Numbers',
        'Read three integers and print the greatest value.',
        'Three integers a, b and c separated by whitespace.',
        'Print the largest of the three values.', 'Values fit in a signed 64-bit integer.',
        '8 3 12', '12', 'Compare all three values and print the maximum.', 'EASY', 'Math', 1000, 256, 100,
        $java2$import java.util.Scanner; public class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); long a = sc.nextLong(), b = sc.nextLong(), c = sc.nextLong(); System.out.println(Math.max(a, Math.max(b, c))); } }$java2$,
        $py2$values = list(map(int, input().split())); print(max(values))$py2$,
        $cpp2$#include <bits/stdc++.h>
using namespace std;
int main() { long long a, b, c; cin >> a >> b >> c; cout << max(a, max(b, c)) << endl; }
$cpp2$,
        $js2$const fs = require('fs'); const values = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number); console.log(Math.max(...values));$js2$,
        'The maximum is the value greater than or equal to each other value.', 'Check negative values and ties too.'
    ),
    (
        'reverse-string', 'Reverse a String',
        'Read one word and print its characters in reverse order.',
        'One non-empty word without spaces.',
        'Print the reversed word.', 'The word contains at most 1000 characters.',
        'code', 'edoc', 'Reverse the order of all characters.', 'EASY', 'Strings', 1000, 256, 100,
        $java3$import java.util.Scanner; public class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); String word = sc.next(); System.out.println(new StringBuilder(word).reverse()); } }$java3$,
        $py3$word = input().strip(); print(word[::-1])$py3$,
        $cpp3$#include <bits/stdc++.h>
using namespace std;
int main() { string word; cin >> word; reverse(word.begin(), word.end()); cout << word << endl; }
$cpp3$,
        $js3$const fs = require('fs'); const word = fs.readFileSync(0, 'utf8').trim(); console.log([...word].reverse().join(''));$js3$,
        'Traverse the word from the final character to the first.', 'A one-character word reverses to itself.'
    ),
    (
        'factorial-number', 'Factorial',
        'Given a non-negative integer n, print n factorial. By definition, 0! = 1.',
        'One integer n.',
        'Print n! as an integer.', '0 <= n <= 12.',
        '5', '120', 'Multiply every integer from 1 through n.', 'EASY', 'Math', 1000, 256, 100,
        $java4$import java.util.Scanner; public class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); int n = sc.nextInt(); long result = 1; for (int i = 2; i <= n; i++) result *= i; System.out.println(result); } }$java4$,
        $py4$import math; n = int(input()); print(math.factorial(n))$py4$,
        $cpp4$#include <bits/stdc++.h>
using namespace std;
int main() { int n; cin >> n; unsigned long long result = 1; for (int i = 2; i <= n; i++) result *= i; cout << result << endl; }
$cpp4$,
        $js4$const fs = require('fs'); const n = Number(fs.readFileSync(0, 'utf8').trim()); let result = 1; for (let i = 2; i <= n; i++) result *= i; console.log(result);$js4$,
        'Start with 1 and multiply by each integer up to n.', 'Handle n = 0; the answer is 1.'
    ),
    (
        'count-vowels', 'Count Vowels',
        'Read one word and print how many vowels it contains. Treat uppercase and lowercase vowels the same.',
        'One word containing English letters.',
        'Print the number of vowels (a, e, i, o, u).', 'The word contains at most 1000 characters.',
        'CodeArena', '5', 'Count every occurrence of a, e, i, o, or u without regard to case.', 'EASY', 'Strings', 1000, 256, 100,
        $java5$import java.util.Scanner; public class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); String word = sc.next().toLowerCase(); int count = 0; for (char ch : word.toCharArray()) if ("aeiou".indexOf(ch) >= 0) count++; System.out.println(count); } }$java5$,
        $py5$word = input().strip().lower(); print(sum(1 for ch in word if ch in 'aeiou'))$py5$,
        $cpp5$#include <bits/stdc++.h>
using namespace std;
int main() { string word; cin >> word; int count = 0; for (char &ch : word) { ch = tolower(static_cast<unsigned char>(ch)); if (string("aeiou").find(ch) != string::npos) count++; } cout << count << endl; }
$cpp5$,
        $js5$const fs = require('fs'); const word = fs.readFileSync(0, 'utf8').trim().toLowerCase(); console.log([...word].filter(ch => 'aeiou'.includes(ch)).length);$js5$,
        'Check each letter and increment the count when it is a vowel.', 'Repeated vowels each count separately.'
    )
)
INSERT INTO problems (
    title, slug, description, input_format, output_format, constraints,
    sample_input, sample_output, explanation, difficulty, category,
    time_limit, memory_limit, points, starter_code_java,
    starter_code_python, starter_code_cpp, starter_code_javascript,
    editorial, hints, editorial_unlock_attempts, created_by, is_active,
    created_at, updated_at
)
SELECT seed.title, seed.slug, seed.description, seed.input_format,
       seed.output_format, seed.constraints, seed.sample_input,
       seed.sample_output, seed.explanation, seed.difficulty, seed.category,
       seed.time_limit, seed.memory_limit, seed.points,
       seed.starter_code_java, seed.starter_code_python,
       seed.starter_code_cpp, seed.starter_code_javascript,
       seed.editorial, seed.hints, 3, admin.id, TRUE,
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM problem_seed AS seed
CROSS JOIN (SELECT id FROM users WHERE role = 'ADMIN' ORDER BY id LIMIT 1) AS admin
WHERE TRUE
ON CONFLICT (slug) DO NOTHING;

WITH case_seed (slug, input_data, expected_output, is_sample, is_hidden) AS (VALUES
    ('sum-two-numbers', '4 7', '11', TRUE, FALSE),
    ('sum-two-numbers', '-5 8', '3', FALSE, FALSE),
    ('sum-two-numbers', '0 0', '0', FALSE, FALSE),
    ('sum-two-numbers', '1000000000 2000000000', '3000000000', FALSE, FALSE),
    ('sum-two-numbers', '-25 -75', '-100', FALSE, TRUE),
    ('maximum-of-three', '8 3 12', '12', TRUE, FALSE),
    ('maximum-of-three', '-5 -2 -9', '-2', FALSE, FALSE),
    ('maximum-of-three', '4 4 1', '4', FALSE, FALSE),
    ('maximum-of-three', '0 -1 0', '0', FALSE, FALSE),
    ('maximum-of-three', '1000000000 2000000000 1500000000', '2000000000', FALSE, TRUE),
    ('reverse-string', 'code', 'edoc', TRUE, FALSE),
    ('reverse-string', 'a', 'a', FALSE, FALSE),
    ('reverse-string', 'racecar', 'racecar', FALSE, FALSE),
    ('reverse-string', 'CodeArena', 'anerAedoC', FALSE, FALSE),
    ('reverse-string', 'algorithm', 'mhtirogla', FALSE, TRUE),
    ('factorial-number', '5', '120', TRUE, FALSE),
    ('factorial-number', '0', '1', FALSE, FALSE),
    ('factorial-number', '1', '1', FALSE, FALSE),
    ('factorial-number', '10', '3628800', FALSE, FALSE),
    ('factorial-number', '12', '479001600', FALSE, TRUE),
    ('count-vowels', 'CodeArena', '5', TRUE, FALSE),
    ('count-vowels', 'rhythm', '0', FALSE, FALSE),
    ('count-vowels', 'AEIOU', '5', FALSE, FALSE),
    ('count-vowels', 'education', '5', FALSE, FALSE),
    ('count-vowels', 'Programming', '3', FALSE, TRUE)
)
INSERT INTO test_cases (problem_id, input_data, expected_output, is_sample, is_hidden)
SELECT problem.id, cases.input_data, cases.expected_output, cases.is_sample, cases.is_hidden
FROM case_seed AS cases
JOIN problems AS problem ON problem.slug = cases.slug
WHERE NOT EXISTS (
    SELECT 1 FROM test_cases AS existing
    WHERE existing.problem_id = problem.id
      AND existing.input_data = cases.input_data
);
