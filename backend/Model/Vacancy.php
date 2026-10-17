<?php
// Vacancy.php - Vacancy Model

require_once __DIR__ . '/../config/database.php';

class Vacancy {
    private $conn;
    private $table = 'vacancies';

    public $id;
    public $school_id;
    public $subject;
    public $teaching_grade;
    public $specific_grade;
    public $pref_province;
    public $pref_district;
    public $pref_school;
    public $description;
    public $posted_by;
    public $status;

    public function __construct() {
        $this->conn = getConnection();
    }

    public function getAll($filters = []) {
        $sql = "SELECT v.*, 
                COALESCE(s.name, u.current_school_name) as school_name, 
                COALESCE(s.province, u.province) as province, 
                COALESCE(s.district, u.district) as district, 
                COALESCE(s.type, u.school_type) as school_type,
                s.city as school_city
                FROM {$this->table} v
                LEFT JOIN users u ON v.posted_by = u.id
                LEFT JOIN schools s ON (v.school_id = s.id OR (v.school_id IS NULL AND u.current_school_name = s.name))
                WHERE 1=1";
        $params = [];
        $types  = '';

        if (!empty($filters['province']) && $filters['province'] !== 'All Provinces') {
            $sql .= ' AND COALESCE(s.province, u.province) = ?';
            $params[] = $filters['province'];
            $types   .= 's';
        }
        if (!empty($filters['district']) && $filters['district'] !== 'All Districts') {
            $sql .= ' AND COALESCE(s.district, u.district) = ?';
            $params[] = $filters['district'];
            $types   .= 's';
        }
        if (!empty($filters['school_name'])) {
            $sql .= ' AND COALESCE(s.name, u.current_school_name) LIKE ?';
            $params[] = '%' . $filters['school_name'] . '%';
            $types   .= 's';
        }
        if (!empty($filters['subject'])) {
            $sql .= ' AND v.subject = ?';
            $params[] = $filters['subject'];
            $types   .= 's';
        }
        if (!empty($filters['school_type']) && $filters['school_type'] !== 'All Types') {
            $sql .= ' AND COALESCE(s.type, u.school_type) = ?';
            $params[] = $filters['school_type'];
            $types   .= 's';
        }
        if (!empty($filters['status']) && $filters['status'] !== 'All') {
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
        $sql = "SELECT v.*, 
                COALESCE(s.name, u.current_school_name) as school_name, 
                COALESCE(s.province, u.province) as province, 
                COALESCE(s.district, u.district) as district, 
                COALESCE(s.type, u.school_type) as school_type,
                s.city as school_city
                FROM {$this->table} v
                LEFT JOIN users u ON v.posted_by = u.id
                LEFT JOIN schools s ON (v.school_id = s.id OR (v.school_id IS NULL AND u.current_school_name = s.name))
                WHERE v.id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function create() {
        $stmt = $this->conn->prepare(
            "INSERT INTO {$this->table} (school_id, subject, teaching_grade, specific_grade, pref_province, pref_district, pref_school, description, posted_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')"
        );
        $stmt->bind_param('isssssssi', $this->school_id, $this->subject, $this->teaching_grade, $this->specific_grade, $this->pref_province, $this->pref_district, $this->pref_school, $this->description, $this->posted_by);
        return $stmt->execute();
    }

    public function findByUserId($userId) {
        $sql = "SELECT v.*, 
                COALESCE(s.name, u.current_school_name) as school_name, 
                COALESCE(s.province, u.province) as province, 
                COALESCE(s.district, u.district) as district,
                COALESCE(s.type, u.school_type) as school_type,
                s.city as school_city
                FROM {$this->table} v 
                LEFT JOIN users u ON v.posted_by = u.id
                LEFT JOIN schools s ON (v.school_id = s.id OR (v.school_id IS NULL AND u.current_school_name = s.name))
                WHERE v.posted_by = ? ORDER BY v.id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function update() {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table} SET subject=?, teaching_grade=?, specific_grade=?, pref_province=?, pref_district=?, pref_school=?, description=?, status=? WHERE id=?"
        );
        $stmt->bind_param('ssssssssi', $this->subject, $this->teaching_grade, $this->specific_grade, $this->pref_province, $this->pref_district, $this->pref_school, $this->description, $this->status, $this->id);
        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = ?");
        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }
}

