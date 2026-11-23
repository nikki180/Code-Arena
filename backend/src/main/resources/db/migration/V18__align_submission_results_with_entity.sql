-- Keep legacy columns in place, but allow rows from the current entity shape
-- to be restored without requiring obsolete per-test-case values.
ALTER TABLE public.submission_results
    ADD COLUMN IF NOT EXISTS total_test_cases INTEGER,
    ADD COLUMN IF NOT EXISTS passed_test_cases INTEGER,
    ADD COLUMN IF NOT EXISTS failed_test_cases INTEGER,
    ADD COLUMN IF NOT EXISTS memory_used NUMERIC,
    ADD COLUMN IF NOT EXISTS score INTEGER,
    ADD COLUMN IF NOT EXISTS verdict VARCHAR(255),
    ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMP;

ALTER TABLE public.submission_results
    ALTER COLUMN execution_time TYPE NUMERIC
        USING execution_time::NUMERIC,
    ALTER COLUMN test_case_id DROP NOT NULL,
    ALTER COLUMN status DROP NOT NULL;
