<?php

declare(strict_types=1);

class AuthController
{
    public static function create(): void
    {
        $payload = get_json_payload();
        $name = trim((string) ($payload['name'] ?? ''));
        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $password = (string) ($payload['password'] ?? '');

        $errors = [];
        if ($name === '') {
            $errors['name'] = 'Name is required.';
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid email is required.';
        }

        if (strlen($password) < 8) {
            $errors['password'] = 'Password must be at least 8 characters.';
        }

        if ($errors !== []) {
            error_response('Validation failed.', 422, $errors);
        }

        if (Admin::findByEmail($email)) {
            error_response('Admin with this email already exists.', 409);
        }

        if (Admin::count() > 0) {
            require_admin_auth();
        }

        $admin = Admin::create([
            'name' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
        ]);

        success_response([
            'admin' => [
                'id' => $admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email'],
            ],
        ], 201);
    }

    public static function login(): void
    {
        $payload = get_json_payload();
        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $password = (string) ($payload['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
            error_response('Email and password are required.', 422);
        }

        $admin = Admin::findByEmail($email);
        if (!$admin || !password_verify($password, $admin['password'])) {
            error_response('Invalid email or password.', 401);
        }

        $token = generate_jwt([
            'sub' => $admin['id'],
            'email' => $admin['email'],
            'role' => 'admin',
        ]);

        success_response([
            'token' => $token,
            'admin' => [
                'id' => $admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email'],
            ],
        ]);
    }
}
