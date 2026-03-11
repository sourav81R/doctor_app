<?php

declare(strict_types=1);

function app_config(): array
{
    static $config;

    if ($config !== null) {
        return $config;
    }

    $allowedOrigins = array_values(
        array_filter(
            array_map(
                static fn(string $origin): string => trim($origin),
                explode(',', getenv('APP_ALLOWED_ORIGINS') ?: 'http://localhost:5173,http://127.0.0.1:5173')
            )
        )
    );

    $config = [
        'jwt_secret' => getenv('JWT_SECRET') ?: 'change-this-secret-before-production',
        'jwt_ttl' => 60 * 60 * 24,
        'allowed_origins' => $allowedOrigins,
    ];

    return $config;
}

function send_cors_headers(): void
{
    $config = app_config();
    $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = $config['allowed_origins'];

    $originHeader = $allowedOrigins[0] ?? '*';
    if (in_array('*', $allowedOrigins, true)) {
        $originHeader = '*';
    } elseif ($requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true)) {
        $originHeader = $requestOrigin;
    }

    header('Access-Control-Allow-Origin: ' . $originHeader);
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
    header('Content-Type: application/json; charset=utf-8');
}
