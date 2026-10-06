<?php
// setup_db.php - Run this script once to create the database and tables

$host = 'localhost';
$user = 'root';
$pass = ''; // Default XAMPP/WAMP password is empty
$dbname = 'transferlk';

// 1. Connect to MySQL (without selecting a database)
$conn = new mysqli($host, $user, $pass);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . "\nMake sure MySQL (XAMPP/WAMP) is running.");
}

echo "Connected to MySQL successfully.\n";

// 2. Create the database
$sql = "CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if ($conn->query($sql) === TRUE) {
    echo "Database '$dbname' created or already exists.\n";
} else {
    die("Error creating database: " . $conn->error);
}

// 3. Select the database
$conn->select_db($dbname);

// 4. Create Tables
$tables = [
    "CREATE TABLE IF NOT EXISTS `schools` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `province` VARCHAR(100) NOT NULL,
        `district` VARCHAR(100) NOT NULL,
        `zone` VARCHAR(100) NULL,
        `address` TEXT NULL,
        `type` VARCHAR(50) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL UNIQUE,
        `mobile` VARCHAR(20) NULL,
        `password` VARCHAR(255) NOT NULL,
        
        `nic` VARCHAR(255) NULL, -- Should be encrypted in production
        `teacher_id` VARCHAR(100) NULL,
        `dob` DATE NULL,
        `gender` VARCHAR(20) NULL,
        
        `subject` VARCHAR(100) NULL,
        `teacher_grade` VARCHAR(100) NULL,
        `years_of_service` INT NULL,
        
        `school_id` INT NULL,
        `current_school_name` VARCHAR(255) NULL,
        `school_type` VARCHAR(50) NULL,
        `position` VARCHAR(100) NULL,
        
        `pref_province` VARCHAR(100) NULL,
        `pref_district` VARCHAR(100) NULL,
        `pref_school` VARCHAR(255) NULL,
        `pref_subject` VARCHAR(100) NULL,
        `transfer_reason` TEXT NULL,
        
        `role` VARCHAR(50) DEFAULT 'teacher',
        `status` VARCHAR(20) DEFAULT 'pending', -- pending, verified
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL
    )",

    "CREATE TABLE IF NOT EXISTS `vacancies` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `school_id` INT NULL,
        `subject` VARCHAR(100) NOT NULL,
        `grade` VARCHAR(50) NOT NULL,
        `description` TEXT NULL,
        `posted_by` INT NOT NULL,
        `status` VARCHAR(20) DEFAULT 'open',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`posted_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
    )"
];

foreach ($tables as $index => $query) {
    if ($conn->query($query) === TRUE) {
        echo "Table " . ($index + 1) . " created successfully.\n";
    } else {
        echo "Error creating table: " . $conn->error . "\n";
    }
}

// 5. Insert some dummy schools
$dummySchools = "INSERT IGNORE INTO `schools` (`id`, `name`, `province`, `district`, `type`) VALUES 
(1, 'Ananda College', 'Western', 'Colombo', 'National'),
(2, 'Nalanda College', 'Western', 'Colombo', 'National'),
(3, 'Dharmaraja College', 'Central', 'Kandy', 'National'),
(4, 'Richmond College', 'Southern', 'Galle', 'National'),
(5, 'Kandy Maha Vidyalaya', 'Central', 'Kandy', 'Provincial')";

if ($conn->query($dummySchools) === TRUE) {
    echo "Dummy schools inserted.\n";
}

echo "\nDatabase setup is complete! ✅\n";
$conn->close();
?>

