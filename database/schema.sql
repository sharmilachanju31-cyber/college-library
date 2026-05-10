-- ============================================
-- COLLEGE LIBRARY MANAGEMENT SYSTEM - DATABASE
-- ============================================

CREATE DATABASE IF NOT EXISTS college_library;
USE college_library;

-- STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    department VARCHAR(100),
    year INT,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOOKS TABLE
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    publisher VARCHAR(100),
    year_published INT,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BORROW RECORDS TABLE
CREATE TABLE IF NOT EXISTS borrow_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE DEFAULT NULL,
    status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    renewed_count INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert sample books
INSERT INTO books (isbn, title, author, category, publisher, year_published, total_copies, available_copies) VALUES
('978-0132350884', 'Clean Code', 'Robert C. Martin', 'Programming', 'Prentice Hall', 2008, 3, 3),
('978-0201633610', 'Design Patterns', 'Gang of Four', 'Programming', 'Addison-Wesley', 1994, 2, 2),
('978-0134685991', 'Effective Java', 'Joshua Bloch', 'Programming', 'Addison-Wesley', 2018, 2, 2),
('978-1491950357', 'Python Data Science Handbook', 'Jake VanderPlas', 'Data Science', 'O\'Reilly', 2016, 4, 4),
('978-0262033848', 'Introduction to Algorithms', 'CLRS', 'Algorithms', 'MIT Press', 2009, 3, 3),
('978-0195391015', 'Database System Concepts', 'Silberschatz', 'Database', 'McGraw Hill', 2010, 2, 2),
('978-0133591620', 'Computer Networks', 'Tanenbaum', 'Networking', 'Prentice Hall', 2014, 2, 2),
('978-1119405672', 'Computer Organization', 'Patterson & Hennessy', 'Architecture', 'Morgan Kaufmann', 2017, 2, 2);

-- Insert default admin
INSERT INTO admins (username, email, password) VALUES
('admin', 'admin@library.edu', '$2b$10$defaulthashfordemopurposes123456');
