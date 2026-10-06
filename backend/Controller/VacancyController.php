<?php
// VacancyController.php - Handles vacancy-related requests

require_once __DIR__ . '/../Model/Vacancy.php';

class VacancyController {

    public function getAll() {
        $filters = [];
        foreach (['province','district','school_name','subject','school_type','status'] as $key) {
            if (!empty($_GET[$key])) $filters[$key] = $_GET[$key];
        }
        $vacancy = new Vacancy();
        return $vacancy->getAll($filters);
    }

    public function getById($id) {
        $vacancy = new Vacancy();
        $data = $vacancy->findById($id);
        if (!$data) {
            http_response_code(404);
            return ['error' => 'Vacancy not found'];
        }
        return $data;
    }

    public function getMyVacancies() {
        $user = (new AuthController())->me();
        if (isset($user['error'])) return $user;

        $vacancy = new Vacancy();
        return $vacancy->findByUserId($user['id']);
    }

    public function create($data) {
        $user = (new AuthController())->me();
        if (isset($user['error'])) return $user;

        $vacancy = new Vacancy();
        $vacancy->school_id  = empty($data['school_id']) ? null : $data['school_id'];
        $vacancy->subject    = $data['subject'] ?? '';
        $vacancy->grade      = $data['grade'] ?? '';
        $vacancy->description = $data['description'] ?? '';
        $vacancy->posted_by  = $user['id'];
        $vacancy->status     = 'open';

        if ($vacancy->create()) {
            http_response_code(201);
            return ['message' => 'Vacancy posted successfully'];
        }

        http_response_code(500);
        return ['error' => 'Failed to post vacancy'];
    }

    public function update($id, $data) {
        $user = (new AuthController())->me();
        if (isset($user['error'])) return $user;

        $vacancy = new Vacancy();
        $existing = $vacancy->findById($id);
        if (!$existing || $existing['posted_by'] != $user['id']) {
            http_response_code(403);
            return ['error' => 'Unauthorized or not found'];
        }

        $vacancy->id = $id;
        $vacancy->subject = $data['subject'] ?? $existing['subject'];
        $vacancy->grade = $data['grade'] ?? $existing['grade'];
        $vacancy->description = $data['description'] ?? $existing['description'];
        $vacancy->status = $data['status'] ?? $existing['status'];

        if ($vacancy->update()) {
            return ['message' => 'Vacancy updated successfully'];
        }
        http_response_code(500);
        return ['error' => 'Failed to update vacancy'];
    }

    public function delete($id) {
        $user = (new AuthController())->me();
        if (isset($user['error'])) return $user;

        $vacancy = new Vacancy();
        $existing = $vacancy->findById($id);
        if (!$existing || $existing['posted_by'] != $user['id']) {
            http_response_code(403);
            return ['error' => 'Unauthorized or not found'];
        }

        if ($vacancy->delete($id)) {
            return ['message' => 'Vacancy deleted'];
        }
        http_response_code(500);
        return ['error' => 'Failed to delete vacancy'];
    }
}

