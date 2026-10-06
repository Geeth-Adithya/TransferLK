-- phpMyAdmin SQL Dump
-- Database: `transferlk`

CREATE DATABASE IF NOT EXISTS `transferlk` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `transferlk`;

-- --------------------------------------------------------

-- Table structure for table `schools`
CREATE TABLE `schools` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `zone` VARCHAR(100) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `type` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table `subjects`
CREATE TABLE `subjects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table `grades`
CREATE TABLE `grades` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `users`
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `mobile` VARCHAR(20) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  
  `nic` VARCHAR(255) DEFAULT NULL,
  `teacher_id` VARCHAR(100) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `gender` VARCHAR(20) DEFAULT NULL,
  
  `subject` VARCHAR(100) DEFAULT NULL,
  `teacher_grade` VARCHAR(100) DEFAULT NULL,
  `years_of_service` INT DEFAULT NULL,
  
  `school_id` INT DEFAULT NULL,
  `current_school_name` VARCHAR(255) DEFAULT NULL,
  `school_type` VARCHAR(50) DEFAULT NULL,
  `position` VARCHAR(100) DEFAULT NULL,
  
  `pref_province` VARCHAR(100) DEFAULT NULL,
  `pref_district` VARCHAR(100) DEFAULT NULL,
  `pref_school` VARCHAR(255) DEFAULT NULL,
  `pref_subject` VARCHAR(100) DEFAULT NULL,
  `transfer_reason` TEXT DEFAULT NULL,
  
  `role` VARCHAR(50) DEFAULT 'teacher',
  `status` VARCHAR(20) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `vacancies`
CREATE TABLE `vacancies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `school_id` INT DEFAULT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `grade` VARCHAR(50) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `posted_by` INT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`posted_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Insert dummy data for schools
INSERT INTO `schools` (`id`, `name`, `province`, `district`, `type`) VALUES 
(1, 'Ananda College', 'Western', 'Colombo', 'National'),
(2, 'Nalanda College', 'Western', 'Colombo', 'National'),
(3, 'Dharmaraja College', 'Central', 'Kandy', 'National'),
(4, 'Richmond College', 'Southern', 'Galle', 'National'),
(5, 'Kandy Maha Vidyalaya', 'Central', 'Kandy', 'Provincial');

INSERT INTO `subjects` (`name`) VALUES 
('Mathematics'), ('Science'), ('English'), ('Sinhala'), ('Tamil'), 
('History'), ('Geography'), ('ICT'), ('Art'), ('Music'), 
('Physical Education'), ('Commerce'), ('Biology'), ('Physics'), ('Chemistry');

INSERT INTO `grades` (`name`) VALUES 
('Grade I'), ('Grade II'), ('Grade III'), ('Senior Grade'), ('Principal Grade');
