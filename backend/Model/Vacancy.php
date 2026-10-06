<?php
// Vacancy.php - Vacancy Model

require_once __DIR__ . '/../config/database.php';

class Vacancy {
    private $conn;
    private $table = 'vacancies';

    public $id;
    public $school_id;
    public $subject;
    public $grade;
    public $description;
    public $posted_by;
    public $status;

    public function __construct() {
        $this->conn = getConnection();
    }

    public function getAll($filters = []) {
        $sql = "SELECT v.*, s.name as school_name, s.province, s.district, s.type as school_type
                FROM {$this->table} v
                LEFT JOIN schools s ON v.school_id = s.id
                WHERE 1=1";
        $params = [];
        $types  = '';

        if (!empty($filters['province'])) {
            $sql .= ' AND s.province = ?';
            $params[] = $filters['province'];
            $types   .= 's';
        }
        if (!empty($filters['district'])) {
            $sql .= ' AND s.district = ?';
            $params[] = $filters['district'];
            $types   .= 's';
        }
        if (!empty($filters['school_name'])) {
            $sql .= ' AND s.name = ?';
            $params[] = $filters['school_name'];
            $types   .= 's';
        }
        if (!empty($filters['subject'])) {
            $sql .= ' AND v.subject = ?';
            $params[] = $filters['subject'];
            $types   .= 's';
        }
        if (!empty($filters['school_type'])) {
            $sql .= ' AND s.type = ?';
            $params[] = $filters['school_type'];
            $types   .= 's';
        }
        if (!empty($filters['status'])) {
            $sql .= ' AND v.status = ?';
            $params[] = $filters['status'];
            $types   .= 's';
        }

        $sql .= ' ORDER BY v.id DESC';

        $stmt = $this->conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function findById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function create() {
        $stmt = $this->conn->prepare(
            "INSERT INTO {$this->table} (school_id, subject, grade, description, posted_by, status) VALUES (?, ?, ?, ?, ?, 'open')"
        );
        $stmt->bind_param('isssi', $this->school_id, $this->subject, $this->grade, $this->description, $this->posted_by);
        return $stmt->execute();
    }

    public function findByUserId($userId) {
        $stmt = $this->conn->prepare("SELECT v.*, s.name as school_name, s.province, s.district FROM {$this->table} v LEFT JOIN schools s ON v.school_id = s.id WHERE v.posted_by = ? ORDER BY v.id DESC");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function update() {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table} SET subject=?, grade=?, description=?, status=? WHERE id=?"
        );
        $stmt->bind_param('ssssi', $this->subject, $this->grade, $this->description, $this->status, $this->id);
        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = ?");
        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }
}

