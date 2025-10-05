-- Seed accounts for grading purposes
-- Run this after the main database setup

-- Basic Client Account (Password: Basic123!)
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_type
)
VALUES (
    'Basic',
    'Client',
    'basic@cse340.net',
    '$2a$10$67.lvJrG8zh5H0WH0WaELugN8KJCyTOzCL/tPJCMjvX2YwfMg3W5u',
    'Client'
)
ON CONFLICT (account_email) DO UPDATE SET
    account_firstname = EXCLUDED.account_firstname,
    account_lastname = EXCLUDED.account_lastname,
    account_password = EXCLUDED.account_password,
    account_type = EXCLUDED.account_type;

-- Manager/Employee Account (Password: Manager123!)
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_type
)
VALUES (
    'Manager',
    'Employee',
    'manager@cse340.net',
    '$2a$10$syCLb5xGrXqAG7U8zRz2oeTOnF9a7pweU1FRhs2JSqZJvOOQ2K4Zu',
    'Employee'
)
ON CONFLICT (account_email) DO UPDATE SET
    account_firstname = EXCLUDED.account_firstname,
    account_lastname = EXCLUDED.account_lastname,
    account_password = EXCLUDED.account_password,
    account_type = EXCLUDED.account_type;

-- Admin Account (Password: Admin123!)
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
    '$2a$10$39uo/bV0BmlF4rtk4XJfSeFHIGHiX8A.VQhsLmojkWdECqJaBK/pG',
    'Admin'
)
ON CONFLICT (account_email) DO UPDATE SET
    account_firstname = EXCLUDED.account_firstname,
    account_lastname = EXCLUDED.account_lastname,
    account_password = EXCLUDED.account_password,
    account_type = EXCLUDED.account_type;

-- Comments and other seed data

-- Sample comments for vehicle testing
INSERT INTO comments (comment_text, inv_id, account_id) 
VALUES 
('Great car! Runs perfectly.', 1, 1),
('Love the performance and style.', 1, 2),
('Excellent condition, highly recommended!', 2, 1),
('Fast delivery and great service.', 3, 2);