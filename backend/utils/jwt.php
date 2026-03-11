<?php

declare(strict_types=1);

function jwt_base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function jwt_base64url_decode(string $value): string
{
    $remainder = strlen($value) % 4;
    if ($remainder > 0) {
        $value .= str_repeat('=', 4 - $remainder);
    }

    return base64_decode(strtr($value, '-_', '+/')) ?: '';
}

function generate_jwt(array $claims): string
{
    $config = app_config();
    $now = time();
    $payload = array_merge(
        [
            'iat' => $now,
            'exp' => $now + (int) $config['jwt_ttl'],
        ],
        $claims
    );

    $header = [
        'alg' => 'HS256',
        'typ' => 'JWT',
    ];

    $segments = [
        jwt_base64url_encode(json_encode($header, JSON_UNESCAPED_SLASHES) ?: '{}'),
        jwt_base64url_encode(json_encode($payload, JSON_UNESCAPED_SLASHES) ?: '{}'),
    ];

    $signature = hash_hmac('sha256', implode('.', $segments), $config['jwt_secret'], true);
    $segments[] = jwt_base64url_encode($signature);

    return implode('.', $segments);
}

function verify_jwt(string $token): array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        throw new RuntimeException('Invalid token format.');
    }

    [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;
    $expectedSignature = jwt_base64url_encode(
        hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, app_config()['jwt_secret'], true)
    );

    if (!hash_equals($expectedSignature, $encodedSignature)) {
        throw new RuntimeException('Invalid token signature.');
    }

    $payload = json_decode(jwt_base64url_decode($encodedPayload), true);
    if (!is_array($payload)) {
        throw new RuntimeException('Invalid token payload.');
    }

    if (($payload['exp'] ?? 0) < time()) {
        throw new RuntimeException('Token has expired.');
    }

    return $payload;
}
