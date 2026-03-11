CREATE DATABASE IF NOT EXISTS clinic_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clinic_app;

CREATE TABLE IF NOT EXISTS admins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS appointments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(150) NOT NULL,
    age VARCHAR(20) DEFAULT '',
    gender VARCHAR(20) DEFAULT '',
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) DEFAULT '',
    doctor VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NULL,
    blood_pressure VARCHAR(50) DEFAULT '',
    temperature VARCHAR(50) DEFAULT '',
    pulse VARCHAR(50) DEFAULT '',
    past_history JSON NULL,
    maternal_history JSON NULL,
    notes TEXT NULL,
    address TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_appointments_date (appointment_date),
    INDEX idx_appointments_doctor (doctor),
    INDEX idx_appointments_patient (patient_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
