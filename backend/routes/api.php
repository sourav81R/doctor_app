<?php

declare(strict_types=1);

function dispatch_api_request(): void
{
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $apiPosition = strpos($uriPath, '/api');

    if ($apiPosition === false) {
        error_response('Route not found.', 404);
    }

    $apiPath = substr($uriPath, $apiPosition);
    $segments = array_values(array_filter(explode('/', trim($apiPath, '/'))));

    if (($segments[0] ?? '') !== 'api') {
        error_response('Route not found.', 404);
    }

    array_shift($segments);

    if (($segments[0] ?? '') === 'appointments') {
        if ($method === 'POST' && ($segments[1] ?? '') === 'create') {
            AppointmentController::create();
        }

        require_admin_auth();

        if ($method === 'GET' && count($segments) === 1) {
            AppointmentController::index();
        }

        if ($method === 'GET' && count($segments) === 2) {
            AppointmentController::show($segments[1]);
        }

        if ($method === 'DELETE' && count($segments) === 2) {
            AppointmentController::delete($segments[1]);
        }
    }

    if (($segments[0] ?? '') === 'admin') {
        if ($method === 'POST' && ($segments[1] ?? '') === 'login') {
            AuthController::login();
        }

        if ($method === 'POST' && ($segments[1] ?? '') === 'create') {
            AuthController::create();
        }
    }

    error_response('Route not found.', 404);
}
