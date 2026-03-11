<?php

declare(strict_types=1);

class PrescriptionController
{
    public static function create(): void
    {
        $payload = get_json_payload();
        $normalized = self::normalizePayload($payload);
        $errors = self::validatePayload($normalized);

        if ($errors !== []) {
            error_response('Validation failed.', 422, $errors);
        }

        $prescription = Prescription::create($normalized);

        success_response([
            'message' => 'Prescription saved successfully.',
            'prescription' => $prescription,
        ], 201);
    }

    private static function normalizePayload(array $payload): array
    {
        return [
            'doctor_name' => trim((string) ($payload['doctor_name'] ?? $payload['doctorName'] ?? '')),
            'patient_name' => trim((string) ($payload['patient_name'] ?? $payload['patientName'] ?? '')),
            'age' => trim((string) ($payload['age'] ?? '')),
            'gender' => trim((string) ($payload['gender'] ?? '')),
            'diagnosis' => trim((string) ($payload['diagnosis'] ?? '')),
            'medicines' => self::normalizeMedicines($payload['medicines'] ?? []),
            'notes' => trim((string) ($payload['notes'] ?? '')),
        ];
    }

    private static function validatePayload(array $payload): array
    {
        $errors = [];

        if ($payload['doctor_name'] === '') {
            $errors['doctor_name'] = 'Doctor name is required.';
        }

        if ($payload['patient_name'] === '') {
            $errors['patient_name'] = 'Patient name is required.';
        }

        if ($payload['diagnosis'] === '') {
            $errors['diagnosis'] = 'Diagnosis is required.';
        }

        if ($payload['medicines'] === []) {
            $errors['medicines'] = 'At least one medicine entry is required.';
        }

        return $errors;
    }

    private static function normalizeMedicines(mixed $value): array
    {
        if (!is_array($value)) {
            return [];
        }

        $medicines = [];

        foreach ($value as $medicine) {
            if (!is_array($medicine)) {
                continue;
            }

            $name = trim((string) ($medicine['name'] ?? ''));
            $duration = trim((string) ($medicine['duration'] ?? ''));

            if ($name === '' && $duration === '') {
                continue;
            }

            $medicines[] = [
                'name' => $name,
                'morning' => trim((string) ($medicine['morning'] ?? '')),
                'afternoon' => trim((string) ($medicine['afternoon'] ?? '')),
                'night' => trim((string) ($medicine['night'] ?? '')),
                'duration' => $duration,
            ];
        }

        return $medicines;
    }
}
