CREATE TABLE IF NOT EXISTS leaderboard (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0,
    total_problems_solved INTEGER NOT NULL DEFAULT 0,
    total_submissions INTEGER NOT NULL DEFAULT 0,
    current_rank INTEGER NOT NULL DEFAULT 0,
    last_submission_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_leaderboard_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_leaderboard_user UNIQUE (user_id)
);
