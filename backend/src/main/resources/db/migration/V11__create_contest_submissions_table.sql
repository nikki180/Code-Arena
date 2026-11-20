CREATE TABLE contest_submissions (
    id BIGSERIAL PRIMARY KEY,
    contest_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    problem_id BIGINT NOT NULL,
    language VARCHAR(30) NOT NULL,
    source_code TEXT NOT NULL,
    status VARCHAR(30) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP NOT NULL
);