<?php

declare(strict_types=1);

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function success_response(mixed $data = null, int $status = 200, array $meta = []): void
{
    $payload = [
        'success' => true,
        'data' => $data,
    ];

    if ($meta !== []) {
        $payload['meta'] = $meta;
    }

    json_response($payload, $status);
}

function error_response(string $message, int $status = 400, array $errors = []): void
{
    $payload = [
        'success' => false,
        'message' => $message,
    ];

    if ($errors !== []) {
        $payload['errors'] = $errors;
    }

    json_response($payload, $status);
}

function get_json_payload(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        error_response('Invalid JSON payload.', 422);
    }

    return $decoded;
}

function get_bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if ($header === '' || !preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
        return null;
    }

    return trim($matches[1]);
}
