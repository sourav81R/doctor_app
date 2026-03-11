<?php

declare(strict_types=1);

class Appointment
{
    public static function create(array $payload): array
    {
        $statement = pdo()->prepare(
            'INSERT INTO appointments (
                patient_name,
                age,
                gender,
                phone,
                email,
                doctor,
                appointment_date,
                appointment_time,
                blood_pressure,
                temperature,
                pulse,
                past_history,
                maternal_history,
                form_snapshot,
                notes,
                address
            ) VALUES (
                :patient_name,
                :age,
                :gender,
                :phone,
                :email,
                :doctor,
                :appointment_date,
                :appointment_time,
                :blood_pressure,
                :temperature,
                :pulse,
                :past_history,
                :maternal_history,
                :form_snapshot,
                :notes,
                :address
            )'
        );

        $statement->execute([
            'patient_name' => trim((string) ($payload['patient_name'] ?? '')),
            'age' => trim((string) ($payload['age'] ?? '')),
            'gender' => trim((string) ($payload['gender'] ?? '')),
            'phone' => trim((string) ($payload['phone'] ?? '')),
            'email' => trim((string) ($payload['email'] ?? '')),
            'doctor' => trim((string) ($payload['doctor'] ?? '')),
            'appointment_date' => trim((string) ($payload['appointment_date'] ?? '')),
            'appointment_time' => self::nullableString($payload['appointment_time'] ?? ''),
            'blood_pressure' => trim((string) ($payload['blood_pressure'] ?? '')),
            'temperature' => trim((string) ($payload['temperature'] ?? '')),
            'pulse' => trim((string) ($payload['pulse'] ?? '')),
            'past_history' => self::encodeJsonArray($payload['past_history'] ?? []),
            'maternal_history' => self::encodeJsonObject($payload['maternal_history'] ?? []),
            'form_snapshot' => self::encodeJsonObject($payload['form_snapshot'] ?? []),
            'notes' => self::nullableString($payload['notes'] ?? ''),
            'address' => self::nullableString($payload['address'] ?? ''),
        ]);

        return self::findById((string) pdo()->lastInsertId()) ?? [];
    }

    public static function paginate(array $filters): array
    {
        $page = max(1, (int) ($filters['page'] ?? 1));
        $limit = min(50, max(1, (int) ($filters['limit'] ?? 10)));
        $offset = ($page - 1) * $limit;
        $whereClauses = [];
        $params = [];

        if (($filters['search'] ?? '') !== '') {
            $whereClauses[] = 'patient_name LIKE :search';
            $params['search'] = '%' . trim((string) $filters['search']) . '%';
        }

        if (($filters['doctor'] ?? '') !== '') {
            $whereClauses[] = 'doctor = :doctor';
            $params['doctor'] = trim((string) $filters['doctor']);
        }

        if (($filters['date'] ?? '') !== '') {
            $whereClauses[] = 'appointment_date = :appointment_date';
            $params['appointment_date'] = trim((string) $filters['date']);
        }

        $whereSql = $whereClauses !== [] ? 'WHERE ' . implode(' AND ', $whereClauses) : '';

        $countStatement = pdo()->prepare("SELECT COUNT(*) FROM appointments {$whereSql}");
        $countStatement->execute($params);
        $total = (int) $countStatement->fetchColumn();

        $statement = pdo()->prepare(
            "SELECT * FROM appointments {$whereSql} ORDER BY created_at DESC LIMIT :limit OFFSET :offset"
        );
        foreach ($params as $key => $value) {
            $statement->bindValue(':' . $key, $value);
        }
        $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
        $statement->bindValue(':offset', $offset, PDO::PARAM_INT);
        $statement->execute();

        $appointments = [];
        foreach ($statement->fetchAll() as $appointment) {
            $appointments[] = self::serialize($appointment);
        }

        $allDoctorsStatement = pdo()->query(
            'SELECT DISTINCT doctor FROM appointments WHERE doctor <> "" ORDER BY doctor ASC'
        );
        $doctorValues = array_values(
            array_filter(
                array_map(
                    static fn(array $row): string => trim((string) ($row['doctor'] ?? '')),
                    $allDoctorsStatement->fetchAll()
                )
            )
        );

        $statsStatement = pdo()->query(
            'SELECT
                COUNT(*) AS total_appointments,
                COUNT(CASE WHEN appointment_date = CURDATE() THEN 1 END) AS today_appointments,
                COUNT(DISTINCT CASE WHEN doctor <> "" THEN doctor END) AS doctors_count
            FROM appointments'
        );
        $stats = $statsStatement->fetch() ?: [];

        return [
            'data' => $appointments,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'total_pages' => (int) ceil($total / $limit),
                'filters' => [
                    'search' => (string) ($filters['search'] ?? ''),
                    'doctor' => (string) ($filters['doctor'] ?? ''),
                    'date' => (string) ($filters['date'] ?? ''),
                ],
                'stats' => [
                    'total_appointments' => (int) ($stats['total_appointments'] ?? 0),
                    'today_appointments' => (int) ($stats['today_appointments'] ?? 0),
                    'doctors_count' => (int) ($stats['doctors_count'] ?? 0),
                ],
                'available_doctors' => array_values($doctorValues),
            ],
        ];
    }

    public static function findById(string $id): ?array
    {
        if (!ctype_digit($id)) {
            return null;
        }

        $statement = pdo()->prepare('SELECT * FROM appointments WHERE id = :id LIMIT 1');
        $statement->execute([
            'id' => (int) $id,
        ]);
        $appointment = $statement->fetch();

        return $appointment ? self::serialize($appointment) : null;
    }

    public static function deleteById(string $id): bool
    {
        if (!ctype_digit($id)) {
            return false;
        }

        $statement = pdo()->prepare('DELETE FROM appointments WHERE id = :id');
        $statement->execute([
            'id' => (int) $id,
        ]);

        return $statement->rowCount() > 0;
    }

    public static function serialize(array $document): array
    {
        return [
            'id' => (string) ($document['id'] ?? ''),
            'patient_name' => (string) ($document['patient_name'] ?? ''),
            'age' => (string) ($document['age'] ?? ''),
            'gender' => (string) ($document['gender'] ?? ''),
            'phone' => (string) ($document['phone'] ?? ''),
            'email' => (string) ($document['email'] ?? ''),
            'doctor' => (string) ($document['doctor'] ?? ''),
            'appointment_date' => (string) ($document['appointment_date'] ?? ''),
            'appointment_time' => (string) ($document['appointment_time'] ?? ''),
            'blood_pressure' => (string) ($document['blood_pressure'] ?? ''),
            'temperature' => (string) ($document['temperature'] ?? ''),
            'pulse' => (string) ($document['pulse'] ?? ''),
            'past_history' => self::decodeJsonArray($document['past_history'] ?? null),
            'maternal_history' => self::decodeJsonObject($document['maternal_history'] ?? null),
            'form_snapshot' => self::decodeJsonObject($document['form_snapshot'] ?? null),
            'notes' => (string) ($document['notes'] ?? ''),
            'address' => (string) ($document['address'] ?? ''),
            'created_at' => isset($document['created_at']) ? (string) $document['created_at'] : null,
        ];
    }

    private static function encodeJsonArray(mixed $value): string
    {
        $arrayValue = is_array($value) ? array_values($value) : [];
        return json_encode($arrayValue, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '[]';
    }

    private static function encodeJsonObject(mixed $value): string
    {
        $objectValue = is_array($value) ? $value : [];
        return json_encode($objectValue, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '{}';
    }

    private static function decodeJsonArray(mixed $value): array
    {
        if (!is_string($value) || trim($value) === '') {
            return [];
        }

        $decoded = json_decode($value, true);
        return is_array($decoded) ? array_values($decoded) : [];
    }

    private static function decodeJsonObject(mixed $value): array
    {
        if (!is_string($value) || trim($value) === '') {
            return [];
        }

        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }

    private static function nullableString(mixed $value): ?string
    {
        $stringValue = trim((string) $value);
        return $stringValue === '' ? null : $stringValue;
    }
}
