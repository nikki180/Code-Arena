CREATE TABLE submission_results (
    id BIGSERIAL PRIMARY KEY,

    submission_id BIGINT NOT NULL,

    test_case_id BIGINT NOT NULL,

    status VARCHAR(50) NOT NULL,

    actual_output TEXT,

    expected_output TEXT,

    execution_time BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);