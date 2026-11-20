CREATE TABLE IF NOT EXISTS users (

    id BIGSERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'USER',

    profile_image TEXT,

    total_problem_solved INTEGER DEFAULT 0,

    total_submission INTEGER DEFAULT 0,

    current_streak INTEGER DEFAULT 0,

    max_streak INTEGER DEFAULT 0,

    is_verified BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);