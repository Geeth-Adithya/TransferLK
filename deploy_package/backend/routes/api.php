<?php
// api.php - Route dispatcher

require_once __DIR__ . '/../Controller/AuthController.php';
require_once __DIR__ . '/../Controller/VacancyController.php';
require_once __DIR__ . '/../Controller/SchoolController.php';
require_once __DIR__ . '/../Controller/ConfigController.php';

require_once __DIR__ . '/../config/EnvLoader.php';

header('Content-Type: application/json');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://transferlk.pearlwaves.online',
    'http://transferlk.pearlwaves.online',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
];
if ($envFrontend = getenv('FRONTEND_URL')) {
    $allowedOrigins[] = rtrim($envFrontend, '/');
}

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method  = $_SERVER['REQUEST_METHOD'];
$uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Universal path resolution (works on localhost, subdirectories, and production domain)
if (preg_match('#/api(?:/+(.*))?$#i', $uriPath, $matches)) {
    $path = $matches[1] ?? '';
} else {
    $path = str_replace(['/TransferLK/backend/api', '/backend/api', '/api'], '', $uriPath);
}
$parts  = array_values(array_filter(explode('/', trim($path, '/')), fn($p) => $p !== ''));
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

$resource = $parts[0] ?? '';
$id       = $parts[1] ?? null;

$auth    = new AuthController();
$vacancy = new VacancyController();
$school  = new SchoolController();
$config  = new ConfigController();

$response = match (true) {
    $resource === 'auth' && $id === 'register'        && $method === 'POST' => $auth->register($body),
    $resource === 'auth' && $id === 'login'           && $method === 'POST' => $auth->login($body),
    $resource === 'auth' && $id === 'forgot-password' && $method === 'POST' => $auth->forgotPassword($body),
    $resource === 'auth' && $id === 'verify-otp'      && $method === 'POST' => $auth->verifyOtp($body),
    $resource === 'auth' && $id === 'reset-password'  && $method === 'POST' => $auth->resetPassword($body),
    $resource === 'auth' && $id === 'me'              && $method === 'GET'  => $auth->me(),
    $resource === 'auth' && $id === 'me'              && $method === 'PUT'  => $auth->updateMe($body),

    $resource === 'vacancies' && $id === 'me'   && $method === 'GET'  => $vacancy->getMyVacancies(),
    $resource === 'vacancies' && $method === 'GET'  && !$id => $vacancy->getAll(),
    $resource === 'vacancies' && $method === 'GET'  && $id  => $vacancy->getById($id),
    $resource === 'vacancies' && $method === 'POST'          => $vacancy->create($body),
    $resource === 'vacancies' && $method === 'PUT'  && $id   => $vacancy->update($id, $body),
    $resource === 'vacancies' && $method === 'DELETE' && $id => $vacancy->delete($id),

    $resource === 'schools'   && $method === 'GET'  && !$id => $school->getAll(),
    $resource === 'schools'   && $method === 'GET'  && $id  => $school->getById($id),

    $resource === 'subjects'  && $method === 'GET'  => $config->getSubjects(),
    $resource === 'grades'    && $method === 'GET'  => $config->getGrades(),

    default => ['error' => 'Route not found']
};

echo json_encode($response);

