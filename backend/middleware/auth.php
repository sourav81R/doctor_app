<?php

declare(strict_types=1);

function require_admin_auth(): array
{
    $token = get_bearer_token();
    if (!$token) {
        error_response('Unauthorized.', 401);
    }

    try {
        $payload = verify_jwt($token);
    } catch (Throwable $exception) {
        error_response($exception->getMessage(), 401);
    }

    if (($payload['role'] ?? '') !== 'admin' || !isset($payload['sub'])) {
        error_response('Unauthorized.', 401);
    }

    $admin = Admin::findById((string) $payload['sub']);
    if (!$admin) {
        error_response('Admin account not found.', 401);
    }

    return $admin;
}
