CREATE TABLE contest_problems (
    id BIGSERIAL PRIMARY KEY,

    contest_id BIGINT NOT NULL,

    problem_id BIGINT NOT NULL,

    problem_order INTEGER NOT NULL,

    points INTEGER NOT NULL,

    CONSTRAINT uk_contest_problem
        UNIQUE (contest_id, problem_id)
);