<?php
// User.php - User Model

require_once __DIR__ . '/../config/database.php';

class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $name;
    public $email;
    public $mobile;
    public $password;
    
    public $nic;
    public $teacher_id;
    public $dob;
    public $gender;
    public $teaching_level;
    public $subject;
    public $teacher_grade;
    public $years_of_service;
    
    public $province;
    public $district;
    
    public $school_id;
    public $current_school_name;
    public $school_type;
    public $position;
    
    public $pref_province;
    public $pref_district;
    public $pref_school;
    public $pref_subject;
    public $transfer_reason;
    
    public $role;
    public $status;

    public function __construct() {
        $this->conn = getConnection();
    }

    public function findByEmail($email) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function create() {
        $hashed = password_hash($this->password, PASSWORD_BCRYPT);
        
        $sql = "INSERT INTO {$this->table} (
            name, email, mobile, password,
            nic, teacher_id, dob, gender, teaching_level, subject, teacher_grade, years_of_service, province, district,
            current_school_name, school_type, position,
            pref_province, pref_district, pref_school, pref_subject, transfer_reason,
            role, status
        ) VALUES (
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, 'pending'
        )";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bind_param('sssssssssssisssssssssss', 
            $this->name, $this->email, $this->mobile, $hashed,
            $this->nic, $this->teacher_id, $this->dob, $this->gender, $this->teaching_level, $this->subject, $this->teacher_grade, $this->years_of_service, $this->province, $this->district,
            $this->current_school_name, $this->school_type, $this->position,
            $this->pref_province, $this->pref_district, $this->pref_school, $this->pref_subject, $this->transfer_reason,
            $this->role
        );
        
        return $stmt->execute();
    }

    public function findById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function update() {
        $sql = "UPDATE {$this->table} SET
            name = ?, mobile = ?,
            nic = ?, teacher_id = ?, dob = ?, gender = ?, teaching_level = ?, subject = ?, teacher_grade = ?, years_of_service = ?, province = ?, district = ?,
            current_school_name = ?, school_type = ?, position = ?,
            pref_province = ?, pref_district = ?, pref_school = ?, pref_subject = ?, transfer_reason = ?
            WHERE id = ?";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bind_param('ssssssssssisssssssssi', 
            $this->name, $this->mobile,
            $this->nic, $this->teacher_id, $this->dob, $this->gender, $this->teaching_level, $this->subject, $this->teacher_grade, $this->years_of_service, $this->province, $this->district,
            $this->current_school_name, $this->school_type, $this->position,
            $this->pref_province, $this->pref_district, $this->pref_school, $this->pref_subject, $this->transfer_reason,
            $this->id
        );
        
        return $stmt->execute();
    }
}
