export const API_BASE = "http://localhost:4000/api/v1";

export async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data; // { token, user }
}

// ROOMS (admin)
export async function adminListRooms(token) {
  const r = await fetch(`${API_BASE}/admin/rooms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Gagal mengambil rooms");
  return d;
}

export async function adminCreateRoom(token, payload) {
  const r = await fetch(`${API_BASE}/admin/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Gagal membuat room");
  return d;
}

export async function adminUpdateRoom(token, id, payload) {
  const r = await fetch(`${API_BASE}/admin/rooms/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Gagal mengubah room");
  return d;
}

export async function adminDeleteRoom(token, id) {
  const r = await fetch(`${API_BASE}/admin/rooms/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Gagal menghapus room");
  return d;
}

export async function adminCreateSlot(token, payload) {
  const r = await fetch(`${API_BASE}/admin/unavailable`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Gagal membuat slot");
  return d;
}
export async function adminDeleteSlot(token, id) {
  const r = await fetch(`${API_BASE}/admin/unavailable/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d.error || "Gagal menghapus slot");
  }
}

export async function adminGetContact(token) {
  const r = await fetch(`${API_BASE}/admin/contact`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Gagal ambil kontak");
  return d;
}

export async function adminUpdateContact(token, payload) {
  const r = await fetch(`${API_BASE}/admin/contact`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Gagal update kontak");
  return d;
}
