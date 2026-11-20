CREATE TABLE contest_registrations (
    id BIGSERIAL PRIMARY KEY,
    contest_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    registered_at TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT uk_contest_registration
        UNIQUE (contest_id, user_id)
);