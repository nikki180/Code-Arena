CREATE TABLE IF NOT EXISTS problems (

    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,

    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    sample_input TEXT,
    sample_output TEXT,
    explanation TEXT,

    difficulty VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,

    time_limit INTEGER NOT NULL DEFAULT 1000,
    memory_limit INTEGER NOT NULL DEFAULT 256,
    points INTEGER NOT NULL DEFAULT 100,

    starter_code_java TEXT,
    starter_code_python TEXT,
    starter_code_cpp TEXT,
    starter_code_javascript TEXT,

    editorial TEXT,
    hints TEXT,

    editorial_unlock_attempts INTEGER NOT NULL DEFAULT 0,

    created_by BIGINT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_problems_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
);