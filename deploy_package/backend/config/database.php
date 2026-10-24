<?php
// database.php - Database connection configuration

require_once __DIR__ . '/EnvLoader.php';

function getConnection() {
    $host = getenv('DB_HOST') ?: 'localhost';
    $user = getenv('DB_USER') ?: 'root';
    $pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';
    $name = getenv('DB_NAME') ?: 'transferlk';
    $port = (int)(getenv('DB_PORT') ?: 3306);

    $conn = @new mysqli($host, $user, $pass, $name, $port);
    if ($conn->connect_error) {
        // Fallback for local XAMPP environment if production credentials fail on localhost
        if ($host === 'localhost' && $user !== 'root') {
            $localConn = @new mysqli('localhost', 'root', '', 'transferlk', 3306);
            if (!$localConn->connect_error) {
                $localConn->set_charset('utf8mb4');
                return $localConn;
            }
        }
        die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
