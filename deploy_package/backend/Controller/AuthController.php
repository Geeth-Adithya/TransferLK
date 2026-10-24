<?php
// AuthController.php - Handles login & register

require_once __DIR__ . '/../Model/User.php';
require_once __DIR__ . '/../services/Mailer.php';

class AuthController {

    public function register($data) {
        $user = new User();
        
        // Step 1: Account Info
        $user->name      = $data['fullName'] ?? '';
        $user->email     = $data['email'] ?? '';
        $user->mobile    = $data['mobile'] ?? '';
        $user->password  = $data['password'] ?? '';
        
        // Step 2: Teacher Info
        // For production, you should encrypt the NIC here using OpenSSL or similar.
        // For now, we store it.
        $user->nic              = $data['nic'] ?? ''; 
        $user->teacher_id       = $data['teacherId'] ?? '';
        $user->dob              = $data['dob'] ?? null;
        $user->gender           = $data['gender'] ?? '';
        $user->teaching_level   = $data['teachingLevel'] ?? '';
        $user->subject          = $data['subject'] ?? '';
        $user->teacher_grade    = $data['teacherGrade'] ?? '';
        $user->years_of_service = isset($data['yearsOfService']) ? (int)$data['yearsOfService'] : null;
        
        // Step 3: Current School Info
        $user->province            = $data['province'] ?? '';
        $user->district            = $data['district'] ?? '';
        $user->current_school_name = $data['currentSchool'] ?? '';
        $user->school_type         = $data['schoolType'] ?? '';
        $user->position            = $data['position'] ?? '';
        
        // Step 4: Transfer Preferences
        $user->pref_province   = $data['prefProvince'] ?? '';
        $user->pref_district   = $data['prefDistrict'] ?? '';
        $user->pref_school     = $data['prefSchool'] ?? '';
        $user->pref_subject    = $data['prefSubject'] ?? '';
        $user->transfer_reason = $data['transferReason'] ?? '';
        
        $user->role = 'teacher';

        if ($user->findByEmail($user->email)) {
            http_response_code(409);
            return ['error' => 'Email already registered'];
        }

        if ($user->create()) {
            http_response_code(201);
            return ['message' => 'Registered successfully'];
        }

        http_response_code(500);
        return ['error' => 'Registration failed'];
    }

    public function login($data) {
        $user = new User();
        $record = $user->findByEmail($data['email'] ?? '');

        if (!$record || !password_verify($data['password'] ?? '', $record['password'])) {
            http_response_code(401);
            return ['error' => 'Invalid credentials'];
        }

        // Simple token (use JWT in production)
        $token = base64_encode($record['id'] . ':' . time() . ':' . bin2hex(random_bytes(16)));
        return ['token' => $token, 'user' => ['id' => $record['id'], 'name' => $record['name'], 'role' => $record['role']]];
    }

    public function me() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            http_response_code(401);
            return ['error' => 'Unauthorized'];
        }

        $token = $matches[1];
        $decoded = base64_decode($token);
        if (!$decoded) {
            http_response_code(401);
            return ['error' => 'Invalid token'];
        }

        $parts = explode(':', $decoded);
        if (count($parts) < 3) {
            http_response_code(401);
            return ['error' => 'Invalid token format'];
        }

        $userId = $parts[0];
        $user = new User();
        // Assume findById exists, if not we'll need to check User.php
        $record = $user->findById($userId); 

        if (!$record) {
            http_response_code(404);
            return ['error' => 'User not found'];
        }

        // Remove sensitive info
        unset($record['password']);
        return $record;
    }

    public function updateMe($data) {
        $currentUser = $this->me();
        if (isset($currentUser['error'])) {
            return $currentUser;
        }

        $user = new User();
        $user->id = $currentUser['id'];
        
        // Update fields
        $user->name = $data['name'] ?? $currentUser['name'];
        $user->mobile = $data['mobile'] ?? $currentUser['mobile'];
        $user->nic = $data['nic'] ?? $currentUser['nic'];
        $user->teacher_id = $data['teacher_id'] ?? $currentUser['teacher_id'];
        $user->dob = $data['dob'] ?? $currentUser['dob'];
        $user->gender = $data['gender'] ?? $currentUser['gender'];
        $user->teaching_level = $data['teaching_level'] ?? $currentUser['teaching_level'];
        $user->subject = $data['subject'] ?? $currentUser['subject'];
        $user->teacher_grade = $data['teacher_grade'] ?? $currentUser['teacher_grade'];
        $user->years_of_service = isset($data['years_of_service']) ? (int)$data['years_of_service'] : $currentUser['years_of_service'];
        $user->province = $data['province'] ?? $currentUser['province'];
        $user->district = $data['district'] ?? $currentUser['district'];
        $user->current_school_name = $data['current_school_name'] ?? $currentUser['current_school_name'];
        $user->school_type = $data['school_type'] ?? $currentUser['school_type'];
        $user->position = $data['position'] ?? $currentUser['position'];
        $user->pref_province = $data['pref_province'] ?? $currentUser['pref_province'];
        $user->pref_district = $data['pref_district'] ?? $currentUser['pref_district'];
        $user->pref_school = $data['pref_school'] ?? $currentUser['pref_school'];
        $user->pref_subject = $data['pref_subject'] ?? $currentUser['pref_subject'];
        $user->transfer_reason = $data['transfer_reason'] ?? $currentUser['transfer_reason'];

        if ($user->update()) {
            return ['message' => 'Profile updated successfully'];
        }
        
        http_response_code(500);
        return ['error' => 'Failed to update profile'];
    }

    public function forgotPassword($data) {
        $email = trim($data['email'] ?? '');
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            return ['error' => 'A valid email address is required'];
        }

        $user = new User();
        $record = $user->findByEmail($email);
        if (!$record) {
            http_response_code(404);
            return ['error' => 'No user account found with this email address'];
        }

        // Generate 6-digit numeric OTP
        $otp = (string)random_int(100000, 999999);
        $user->saveResetOtp($email, $otp, 15);

        // Send email via Gmail SMTP using Mailer service (configured in .env)
        $name = $record['name'] ?? 'Teacher';
        $mailer = new Mailer();
        $sent = $mailer->sendPasswordResetOtp($email, $name, $otp);

        $response = [
            'message' => 'A 6-digit verification code has been sent to your email.'
        ];

        // If email failed to send (e.g. SMTP credentials issue)
        if (!$sent) {
            $response['warning'] = 'Could not deliver email via SMTP. Please verify Gmail App Password configuration in backend/.env.';
            // Include dev_otp fallback only for local environment
            if (isset($_SERVER['SERVER_NAME']) && in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1'])) {
                $response['dev_otp'] = $otp;
            }
        }

        return $response;
    }

    public function verifyOtp($data) {
        $email = trim($data['email'] ?? '');
        $otp   = trim($data['otp'] ?? '');

        if (empty($email) || empty($otp)) {
            http_response_code(400);
            return ['error' => 'Email and verification code are required'];
        }

        $user = new User();
        if ($user->verifyResetOtp($email, $otp)) {
            return ['valid' => true, 'message' => 'Verification code confirmed'];
        }

        http_response_code(400);
        return ['error' => 'Invalid or expired verification code'];
    }

    public function resetPassword($data) {
        $email       = trim($data['email'] ?? '');
        $otp         = trim($data['otp'] ?? '');
        $newPassword = $data['newPassword'] ?? '';

        if (empty($email) || empty($otp) || empty($newPassword)) {
            http_response_code(400);
            return ['error' => 'All fields are required'];
        }

        if (strlen($newPassword) < 8) {
            http_response_code(400);
            return ['error' => 'Password must be at least 8 characters long'];
        }

        $user = new User();
        if (!$user->verifyResetOtp($email, $otp)) {
            http_response_code(400);
            return ['error' => 'Invalid or expired verification code'];
        }

        if ($user->resetPassword($email, $newPassword)) {
            return ['message' => 'Password reset successfully. You can now login.'];
        }

        http_response_code(500);
        return ['error' => 'Failed to reset password. Please try again.'];
    }
}
