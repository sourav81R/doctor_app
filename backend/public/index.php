<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/env.php';
require_once dirname(__DIR__) . '/config/app.php';
require_once dirname(__DIR__) . '/utils/response.php';

load_env_file(dirname(__DIR__) . '/.env');

send_cors_headers();

set_exception_handler(static function (Throwable $exception): void {
    error_response($exception->getMessage(), 500);
});

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
if (is_file($autoloadPath)) {
    require_once $autoloadPath;
}
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/utils/jwt.php';
require_once dirname(__DIR__) . '/models/Admin.php';
require_once dirname(__DIR__) . '/models/Appointment.php';
require_once dirname(__DIR__) . '/models/Prescription.php';
require_once dirname(__DIR__) . '/middleware/auth.php';
require_once dirname(__DIR__) . '/controllers/AuthController.php';
require_once dirname(__DIR__) . '/controllers/AppointmentController.php';
require_once dirname(__DIR__) . '/controllers/PrescriptionController.php';
require_once dirname(__DIR__) . '/routes/api.php';

dispatch_api_request();
