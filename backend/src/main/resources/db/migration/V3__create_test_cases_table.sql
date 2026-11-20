CREATE TABLE IF NOT EXISTS test_cases (

    id BIGSERIAL PRIMARY KEY,

    problem_id BIGINT NOT NULL,

    input_data TEXT NOT NULL,

    expected_output TEXT NOT NULL,

    is_sample BOOLEAN DEFAULT FALSE,

    is_hidden BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_test_cases_problem
        FOREIGN KEY (problem_id)
        REFERENCES problems(id)
        ON DELETE CASCADE
);