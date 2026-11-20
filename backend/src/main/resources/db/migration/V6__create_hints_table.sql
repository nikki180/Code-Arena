CREATE TABLE hints (
    id BIGSERIAL PRIMARY KEY,

    problem_id BIGINT NOT NULL,

    hint_number INT NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hint_problem
        FOREIGN KEY (problem_id)
        REFERENCES problems(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_problem_hint_number
        UNIQUE (problem_id, hint_number)
);