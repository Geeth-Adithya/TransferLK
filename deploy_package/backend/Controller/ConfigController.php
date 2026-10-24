<?php
require_once __DIR__ . '/../config/database.php';

class ConfigController {
    private $conn;

    public function __construct() {
        $this->conn = getConnection();
    }

    public function getSubjects() {
        $result = $this->conn->query("SELECT id, name, category, level FROM subjects ORDER BY level ASC, category ASC, name ASC");
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    }

    public function getGrades() {
        $result = $this->conn->query("SELECT id, name, category FROM grades ORDER BY id ASC");
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    }
}

