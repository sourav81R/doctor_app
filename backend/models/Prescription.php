<?php

declare(strict_types=1);

class Prescription
{
    public static function create(array $payload): array
    {
        $statement = pdo()->prepare(
            'INSERT INTO prescriptions (
                doctor_name,
                patient_name,
                age,
                gender,
                diagnosis,
                medicines,
                notes
            ) VALUES (
                :doctor_name,
                :patient_name,
                :age,
                :gender,
                :diagnosis,
                :medicines,
                :notes
            )'
        );

        $statement->execute([
            'doctor_name' => trim((string) ($payload['doctor_name'] ?? '')),
            'patient_name' => trim((string) ($payload['patient_name'] ?? '')),
            'age' => trim((string) ($payload['age'] ?? '')),
            'gender' => trim((string) ($payload['gender'] ?? '')),
            'diagnosis' => self::nullableString($payload['diagnosis'] ?? ''),
            'medicines' => self::encodeMedicines($payload['medicines'] ?? []),
            'notes' => self::nullableString($payload['notes'] ?? ''),
        ]);

        return self::findById((string) pdo()->lastInsertId()) ?? [];
    }

    public static function findById(string $id): ?array
    {
        if (!ctype_digit($id)) {
            return null;
        }

        $statement = pdo()->prepare('SELECT * FROM prescriptions WHERE id = :id LIMIT 1');
        $statement->execute([
            'id' => (int) $id,
        ]);
        $prescription = $statement->fetch();

        return $prescription ? self::serialize($prescription) : null;
    }

    public static function serialize(array $document): array
    {
        return [
            'id' => (string) ($document['id'] ?? ''),
            'doctor_name' => (string) ($document['doctor_name'] ?? ''),
            'patient_name' => (string) ($document['patient_name'] ?? ''),
            'age' => (string) ($document['age'] ?? ''),
            'gender' => (string) ($document['gender'] ?? ''),
            'diagnosis' => (string) ($document['diagnosis'] ?? ''),
            'medicines' => self::decodeMedicines($document['medicines'] ?? null),
            'notes' => (string) ($document['notes'] ?? ''),
            'created_at' => isset($document['created_at']) ? (string) $document['created_at'] : null,
        ];
    }

    private static function encodeMedicines(mixed $value): string
    {
        $medicines = is_array($value) ? array_values($value) : [];
        return json_encode($medicines, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '[]';
    }

    private static function decodeMedicines(mixed $value): array
    {
        if (!is_string($value) || trim($value) === '') {
            return [];
        }

        $decoded = json_decode($value, true);
        return is_array($decoded) ? array_values($decoded) : [];
    }

    private static function nullableString(mixed $value): ?string
    {
        $stringValue = trim((string) $value);
        return $stringValue === '' ? null : $stringValue;
    }
}
