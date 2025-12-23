-- ================================================
-- SQL Server Database Setup Script
-- ================================================
-- This script creates sample tables and inserts test data
-- Run this in SQL Server Management Studio (SSMS) or Azure Data Studio

-- Switch to your database
USE users;
GO

-- ================================================
-- Create 'info' table
-- ================================================
IF OBJECT_ID('info', 'U') IS NOT NULL
    DROP TABLE info;
GO

CREATE TABLE info (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(50) NOT NULL
);
GO

-- ================================================
-- Insert sample data into 'info' table
-- ================================================
INSERT INTO info (name) VALUES 
('John Doe'),
('Jane Smith'),
('Mike Johnson'),
('Sarah Williams'),
('Robert Brown'),
('Emily Davis'),
('Michael Wilson'),
('Jessica Martinez'),
('David Anderson'),
('Jennifer Taylor');
GO

-- ================================================
-- Create 'users' table (additional example)
-- ================================================
IF OBJECT_ID('users', 'U') IS NOT NULL
    DROP TABLE users;
GO

CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    created_date DATETIME DEFAULT GETDATE()
);
GO

-- ================================================
-- Insert sample data into 'users' table
-- ================================================
INSERT INTO users (name, email) VALUES 
('Alice Johnson', 'alice.j@example.com'),
('Bob Smith', 'bob.smith@example.com'),
('Charlie Brown', 'charlie.b@example.com'),
('Diana Prince', 'diana.p@example.com'),
('Edward Norton', 'edward.n@example.com');
GO

-- ================================================
-- Verify data was inserted
-- ================================================
SELECT 'info table data:' AS [Table];
SELECT * FROM info;

SELECT 'users table data:' AS [Table];
SELECT * FROM users;
GO

-- ================================================
-- Useful Queries for Testing
-- ================================================

-- Count records
SELECT COUNT(*) AS TotalRecords FROM info;
SELECT COUNT(*) AS TotalRecords FROM users;

-- Get top 5 records
SELECT TOP 5 * FROM info ORDER BY id;
SELECT TOP 5 * FROM users ORDER BY id;

-- Search by name
SELECT * FROM info WHERE name LIKE '%John%';
SELECT * FROM users WHERE name LIKE '%Alice%';
GO
