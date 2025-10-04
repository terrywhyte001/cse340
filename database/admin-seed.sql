-- Add default admin account for testing/grading
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_type
)
VALUES (
    'Admin',
    'User',
    'admin@cse340.net',
    '$2a$10$sRD1Z0zqf8d5hlRMvMmLs.pZ8bI7OQQw6oIfJVJ3jRZ0l6pTX9tIK',  -- Password is "I@mAn@dmin"
    'Admin'
)
ON CONFLICT (account_email) DO NOTHING;