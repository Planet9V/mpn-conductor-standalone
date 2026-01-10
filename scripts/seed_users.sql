-- MPN Conductor User Seed Script
-- Creates initial admin and user accounts

-- Administrator account
INSERT INTO users (name, email, password_hash, role, is_approved)
VALUES (
    'Jim McKenney',
    'mckenneyengineers@gmail.com',
    '$2b$10$VfnimqDSQ4VVj/RT.258Fu6iP9No4174m4bkaf6HhJD6GAfazyzjG',
    'Administrator',
    true
)
ON CONFLICT (email) DO UPDATE SET 
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    is_approved = EXCLUDED.is_approved;

-- User account
INSERT INTO users (name, email, password_hash, role, is_approved)
VALUES (
    'Tom McKenney',
    'jims67mustang@gmail.com',
    '$2b$10$vIVmOyeKmE8FGKIEqehEvO/FVtDyAtBDYSJ7jyoujt7JLPbWSCwRa',
    'User',
    true
)
ON CONFLICT (email) DO UPDATE SET 
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    is_approved = EXCLUDED.is_approved;
