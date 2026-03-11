<?php

declare(strict_types=1);

class Admin
{
    public static function count(): int
    {
        return (int) pdo()->query('SELECT COUNT(*) FROM admins')->fetchColumn();
    }

    public static function findByEmail(string $email): ?array
    {
        $statement = pdo()->prepare('SELECT * FROM admins WHERE email = :email LIMIT 1');
        $statement->execute([
            'email' => strtolower(trim($email)),
        ]);
        $admin = $statement->fetch();

        return $admin ? self::serialize($admin) : null;
    }

    public static function findById(string $id): ?array
    {
        if (!ctype_digit($id)) {
            return null;
        }

        $statement = pdo()->prepare('SELECT * FROM admins WHERE id = :id LIMIT 1');
        $statement->execute([
            'id' => (int) $id,
        ]);
        $admin = $statement->fetch();

        return $admin ? self::serialize($admin) : null;
    }

    public static function create(array $payload): array
    {
        $statement = pdo()->prepare(
            'INSERT INTO admins (name, email, password) VALUES (:name, :email, :password)'
        );
        $statement->execute([
            'name' => trim((string) ($payload['name'] ?? '')),
            'email' => strtolower(trim((string) ($payload['email'] ?? ''))),
            'password' => (string) ($payload['password'] ?? ''),
        ]);

        return self::findById((string) pdo()->lastInsertId()) ?? [];
    }

    public static function serialize(array $document): array
    {
        return [
            'id' => (string) ($document['id'] ?? ''),
            'name' => (string) ($document['name'] ?? ''),
            'email' => (string) ($document['email'] ?? ''),
            'password' => (string) ($document['password'] ?? ''),
            'created_at' => isset($document['created_at']) ? (string) $document['created_at'] : null,
        ];
    }
}
