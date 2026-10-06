<?php
// SchoolController.php - Handles school-related requests

require_once __DIR__ . '/../Model/School.php';

class SchoolController {

    public function getAll() {
        $school = new School();
        return $school->getAll();
    }

    public function getById($id) {
        $school = new School();
        $data = $school->findById($id);
        if (!$data) {
            http_response_code(404);
            return ['error' => 'School not found'];
        }
        return $data;
    }
}

