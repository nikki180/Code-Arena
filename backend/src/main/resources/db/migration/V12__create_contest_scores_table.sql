CREATE TABLE contest_scores (
    id BIGSERIAL PRIMARY KEY,
    contest_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0,
    problems_solved INTEGER NOT NULL DEFAULT 0,
    total_submissions INTEGER NOT NULL DEFAULT 0,
    current_rank INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_contest_user_score
        UNIQUE (contest_id, user_id)
);