<?php

declare(strict_types=1);

class AppointmentController
{
    public static function create(): void
    {
        $payload = get_json_payload();
        $normalized = self::normalizeAppointmentPayload($payload);
        $errors = self::validateAppointmentPayload($normalized);

        if ($errors !== []) {
            error_response('Validation failed.', 422, $errors);
        }

        $appointment = Appointment::create($normalized);
        success_response([
            'message' => 'Appointment created successfully.',
            'appointment' => $appointment,
        ], 201);
    }

    public static function index(): void
    {
        $result = Appointment::paginate([
            'search' => trim((string) ($_GET['search'] ?? '')),
            'doctor' => trim((string) ($_GET['doctor'] ?? '')),
            'date' => trim((string) ($_GET['date'] ?? '')),
            'consultation_type' => trim((string) ($_GET['consultation_type'] ?? '')),
            'page' => (int) ($_GET['page'] ?? 1),
            'limit' => (int) ($_GET['limit'] ?? 10),
        ]);

        success_response($result['data'], 200, $result['meta']);
    }

    public static function show(string $id): void
    {
        $appointment = Appointment::findById($id);
        if (!$appointment) {
            error_response('Appointment not found.', 404);
        }

        success_response($appointment);
    }

    public static function delete(string $id): void
    {
        if (!Appointment::deleteById($id)) {
            error_response('Appointment not found.', 404);
        }

        success_response([
            'message' => 'Appointment deleted successfully.',
        ]);
    }

    private static function normalizeAppointmentPayload(array $payload): array
    {
        $patientName = trim((string) ($payload['patient_name'] ?? ''));
        if ($patientName === '') {
            $patientName = trim(
                implode(
                    ' ',
                    array_filter([
                        trim((string) ($payload['firstName'] ?? '')),
                        trim((string) ($payload['lastName'] ?? '')),
                    ])
                )
            );
        }

        $notesParts = array_values(
            array_filter([
                trim((string) ($payload['notes'] ?? '')),
                trim((string) ($payload['comments'] ?? '')),
                trim((string) ($payload['message'] ?? '')),
            ])
        );

        return [
            'patient_name' => $patientName,
            'age' => trim((string) ($payload['age'] ?? self::calculateAge((string) ($payload['dateOfBirth'] ?? '')))),
            'gender' => trim((string) ($payload['gender'] ?? '')),
            'phone' => trim((string) ($payload['phone'] ?? $payload['contactNumber'] ?? '')),
            'email' => trim((string) ($payload['email'] ?? '')),
            'doctor' => trim((string) ($payload['doctor'] ?? $payload['doctorName'] ?? '')),
            'appointment_date' => trim((string) ($payload['appointment_date'] ?? $payload['appointmentDate'] ?? '')),
            'appointment_time' => trim((string) ($payload['appointment_time'] ?? $payload['appointmentTime'] ?? '')),
            'consultation_type' => self::normalizeConsultationType(
                (string) ($payload['consultation_type'] ?? $payload['consultationType'] ?? '')
            ),
            'consultation_platform' => trim(
                (string) ($payload['consultation_platform'] ?? $payload['consultationPlatform'] ?? '')
            ),
            'consultation_message' => trim(
                (string) ($payload['consultation_message'] ?? $payload['consultationMessage'] ?? '')
            ),
            'blood_pressure' => trim((string) ($payload['blood_pressure'] ?? $payload['bp'] ?? '')),
            'temperature' => trim((string) ($payload['temperature'] ?? '')),
            'pulse' => trim((string) ($payload['pulse'] ?? $payload['pr'] ?? '')),
            'past_history' => self::extractPastHistory($payload),
            'maternal_history' => self::extractMaternalHistory($payload),
            'form_snapshot' => self::buildFormSnapshot($payload),
            'notes' => implode(' | ', $notesParts),
            'address' => trim((string) ($payload['address'] ?? '')),
        ];
    }

    private static function validateAppointmentPayload(array $payload): array
    {
        $errors = [];

        if ($payload['patient_name'] === '') {
            $errors['patient_name'] = 'Patient name is required.';
        }

        if ($payload['gender'] === '') {
            $errors['gender'] = 'Gender is required.';
        }

        if ($payload['phone'] === '') {
            $errors['phone'] = 'Phone number is required.';
        }

        if ($payload['doctor'] === '') {
            $errors['doctor'] = 'Doctor is required.';
        }

        if ($payload['appointment_date'] === '') {
            $errors['appointment_date'] = 'Appointment date is required.';
        }

        if (!in_array($payload['consultation_type'], ['clinic', 'teleconsultation'], true)) {
            $errors['consultation_type'] = 'Consultation type is invalid.';
        }

        if ($payload['consultation_type'] === 'teleconsultation' && $payload['consultation_platform'] === '') {
            $errors['consultation_platform'] = 'Preferred platform is required for teleconsultation.';
        }

        if ($payload['email'] !== '' && !filter_var($payload['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email is invalid.';
        }

        return $errors;
    }

    private static function extractPastHistory(array $payload): array
    {
        if (isset($payload['past_history']) && is_array($payload['past_history'])) {
            return array_values(array_filter(array_map('strval', $payload['past_history'])));
        }

        $medicalHistory = $payload['medicalHistory'] ?? [];
        if (!is_array($medicalHistory)) {
            return [];
        }

        return array_values(
            array_keys(
                array_filter(
                    $medicalHistory,
                    static fn(mixed $checked): bool => (bool) $checked
                )
            )
        );
    }

    private static function extractMaternalHistory(array $payload): array
    {
        if (isset($payload['maternal_history']) && is_array($payload['maternal_history'])) {
            return $payload['maternal_history'];
        }

        return array_filter([
            'lmp' => trim((string) ($payload['lmp'] ?? '')),
            'pog' => trim((string) ($payload['pog'] ?? '')),
            'edd' => trim((string) ($payload['edd'] ?? '')),
            'allergy' => trim((string) ($payload['allergy'] ?? '')),
            'comments' => trim((string) ($payload['comments'] ?? '')),
        ], static fn(string $value): bool => $value !== '');
    }

    private static function buildFormSnapshot(array $payload): array
    {
        $patientName = trim((string) ($payload['patient_name'] ?? ''));
        if ($patientName === '') {
            $patientName = trim(
                implode(
                    ' ',
                    array_filter([
                        trim((string) ($payload['firstName'] ?? '')),
                        trim((string) ($payload['lastName'] ?? '')),
                    ])
                )
            );
        }

        $nameParts = preg_split('/\s+/', $patientName) ?: [];
        $medicalHistory = $payload['medicalHistory'] ?? null;
        if (!is_array($medicalHistory)) {
            $medicalHistory = [];
            foreach (self::extractPastHistory($payload) as $item) {
                $medicalHistory[(string) $item] = true;
            }
        }

        $maternalHistory = self::extractMaternalHistory($payload);

        return [
            'firstName' => trim((string) ($payload['firstName'] ?? ($nameParts[0] ?? ''))),
            'lastName' => trim((string) ($payload['lastName'] ?? implode(' ', array_slice($nameParts, 1)))),
            'patient_name' => $patientName,
            'appointmentDate' => trim((string) ($payload['appointmentDate'] ?? $payload['appointment_date'] ?? '')),
            'appointmentTime' => trim((string) ($payload['appointmentTime'] ?? $payload['appointment_time'] ?? '')),
            'consultationType' => self::normalizeConsultationType(
                (string) ($payload['consultationType'] ?? $payload['consultation_type'] ?? '')
            ),
            'consultationPlatform' => trim(
                (string) ($payload['consultationPlatform'] ?? $payload['consultation_platform'] ?? '')
            ),
            'consultationMessage' => trim(
                (string) ($payload['consultationMessage'] ?? $payload['consultation_message'] ?? '')
            ),
            'dateOfBirth' => trim((string) ($payload['dateOfBirth'] ?? '')),
            'age' => trim((string) ($payload['age'] ?? self::calculateAge((string) ($payload['dateOfBirth'] ?? '')))),
            'gender' => trim((string) ($payload['gender'] ?? '')),
            'email' => trim((string) ($payload['email'] ?? '')),
            'gcs' => trim((string) ($payload['gcs'] ?? '')),
            'bp' => trim((string) ($payload['bp'] ?? $payload['blood_pressure'] ?? '')),
            'pr' => trim((string) ($payload['pr'] ?? $payload['pulse'] ?? '')),
            'rr' => trim((string) ($payload['rr'] ?? '')),
            'rbs' => trim((string) ($payload['rbs'] ?? '')),
            'temperature' => trim((string) ($payload['temperature'] ?? '')),
            'height' => trim((string) ($payload['height'] ?? '')),
            'weight' => trim((string) ($payload['weight'] ?? '')),
            'spo2' => trim((string) ($payload['spo2'] ?? '')),
            'medicalHistory' => $medicalHistory,
            'lmp' => trim((string) ($payload['lmp'] ?? ($maternalHistory['lmp'] ?? ''))),
            'pog' => trim((string) ($payload['pog'] ?? ($maternalHistory['pog'] ?? ''))),
            'edd' => trim((string) ($payload['edd'] ?? ($maternalHistory['edd'] ?? ''))),
            'allergy' => trim((string) ($payload['allergy'] ?? ($maternalHistory['allergy'] ?? ''))),
            'comments' => trim((string) ($payload['comments'] ?? ($maternalHistory['comments'] ?? ''))),
            'contactNumber' => trim((string) ($payload['contactNumber'] ?? $payload['phone'] ?? '')),
            'address' => trim((string) ($payload['address'] ?? '')),
            'doctorName' => trim((string) ($payload['doctorName'] ?? $payload['doctor'] ?? '')),
            'message' => trim((string) ($payload['message'] ?? $payload['notes'] ?? '')),
        ];
    }

    private static function calculateAge(string $dateOfBirth): string
    {
        if ($dateOfBirth === '') {
            return '';
        }

        try {
            $dob = new DateTimeImmutable($dateOfBirth);
            $today = new DateTimeImmutable('today');
            return (string) $today->diff($dob)->y;
        } catch (Throwable) {
            return '';
        }
    }

    private static function normalizeConsultationType(string $value): string
    {
        return trim(strtolower($value)) === 'teleconsultation' ? 'teleconsultation' : 'clinic';
    }
}
