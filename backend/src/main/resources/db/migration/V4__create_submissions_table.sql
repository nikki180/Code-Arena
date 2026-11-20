CREATE TABLE submissions (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    problem_id BIGINT NOT NULL,

    language VARCHAR(50) NOT NULL,

    source_code TEXT NOT NULL,

    status VARCHAR(20) DEFAULT 'PENDING',

    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);