const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api").replace(/\/$/, "");
const ADMIN_SESSION_KEY = "clinic_admin_session";

async function request(path, options = {}) {
  const { token, headers = {}, ...restOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : { success: response.ok, message: await response.text() };

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.message || "Request failed.");
    error.status = response.status;
    error.errors = payload.errors ?? {};
    throw error;
  }

  return payload;
}

export function createAppointment(formData) {
  return request("/appointments/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
}

export function loginAdmin(credentials) {
  return request("/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

export function createAdmin(payload, token) {
  return request("/admin/create", {
    method: "POST",
    token,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function getAppointments({
  token,
  search = "",
  doctor = "",
  date = "",
  consultationType = "",
  page = 1,
  limit = 10,
}) {
  const params = new URLSearchParams({
    search,
    doctor,
    date,
    consultation_type: consultationType,
    page: String(page),
    limit: String(limit),
  });

  return request(`/appointments?${params.toString()}`, {
    token,
    method: "GET",
  });
}

export function getAppointment(id, token) {
  return request(`/appointments/${id}`, {
    token,
    method: "GET",
  });
}

export function deleteAppointment(id, token) {
  return request(`/appointments/${id}`, {
    token,
    method: "DELETE",
  });
}

export function savePrescription(payload, token) {
  return request("/prescriptions/save", {
    method: "POST",
    token,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function getAdminSession() {
  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(session) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getAdminToken() {
  return getAdminSession()?.token ?? "";
}

export { API_BASE_URL };
