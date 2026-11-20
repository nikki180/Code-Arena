CREATE TABLE contests (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    start_time TIMESTAMP NOT NULL,

    end_time TIMESTAMP NOT NULL,

    created_by BIGINT NOT NULL,

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP
);