// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  API_BASE,
  adminListRooms,
  adminCreateRoom,
  adminUpdateRoom,
  adminDeleteRoom,
  adminCreateSlot,
  adminGetContact,
  adminUpdateContact, // 👈 tambahkan ini
} from "../../api";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-red-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();

  // ================== ROOMS CRUD ==================
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null); // room object | null

  const [form, setForm] = useState({
    name: "",
    capacity: "",
    pricePerHour: "",
    facilities: "", // comma-separated string
    isActive: true,
  });

  const titleModal = useMemo(() => (editing ? "Edit Room" : "Tambah Room"), [editing]);

  async function loadRooms() {
    setLoading(true);
    setErr("");
    try {
      const data = await adminListRooms(token);
      setRooms(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      capacity: "",
      pricePerHour: "",
      facilities: "",
      isActive: true,
    });
    setOpenModal(true);
  }

  function openEdit(r) {
    setEditing(r);
    setForm({
      name: r.name,
      capacity: String(r.capacity),
      pricePerHour: String(r.pricePerHour),
      facilities: Array.isArray(r.facilities) ? r.facilities.join(", ") : "",
      isActive: !!r.isActive,
    });
    setOpenModal(true);
  }

  async function submitForm(e) {
    e.preventDefault();
    try {
      const payload = {
        name: form.name.trim(),
        capacity: Number(form.capacity),
        pricePerHour: Number(form.pricePerHour),
        facilities: form.facilities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        isActive: !!form.isActive,
      };

      if (!payload.name || !payload.capacity || !payload.pricePerHour) {
        alert("Nama, Kapasitas, dan Harga/jam wajib diisi.");
        return;
      }

      if (editing) {
        await adminUpdateRoom(token, editing.id, payload);
      } else {
        await adminCreateRoom(token, payload);
      }

      setOpenModal(false);
      await loadRooms();
    } catch (e) {
      alert(e.message);
    }
  }

  async function removeRoom(id) {
    if (!confirm("Yakin ingin menghapus? (soft delete)")) return;
    try {
      await adminDeleteRoom(token, id);
      await loadRooms();
    } catch (e) {
      alert(e.message);
    }
  }

  // ================== AVAILABILITY (BLOCK SLOTS) ==================
  const [slotForm, setSlotForm] = useState({
    roomId: "",
    date: "",
    start: "10:00",
    end: "12:00",
    reason: "",
  });
  const [slotsPreview, setSlotsPreview] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // otomatis pilih Meeting Room saat rooms sudah ada
  useEffect(() => {
    if (rooms.length && !slotForm.roomId) {
      const meeting = rooms.find((r) => r.name === "Meeting Room") || rooms[0];
      if (meeting) setSlotForm((f) => ({ ...f, roomId: meeting.id }));
    }
  }, [rooms, slotForm.roomId]);

  // load slots preview untuk tanggal + room agar admin bisa lihat
  async function loadSlotsPreview() {
    if (!slotForm.roomId || !slotForm.date) {
      setSlotsPreview([]);
      return;
    }
    setLoadingSlots(true);
    const d = await fetch(`${API_BASE}/rooms/${slotForm.roomId}/unavailable?date=${slotForm.date}`).then((r) => r.json());
    setSlotsPreview(d || []);
    setLoadingSlots(false);
  }

  useEffect(() => {
    loadSlotsPreview(); // eslint-disable-next-line
  }, [slotForm.roomId, slotForm.date]);

  async function submitSlot(e) {
    e.preventDefault();
    try {
      // validasi simple
      if (!slotForm.roomId || !slotForm.date || !slotForm.start || !slotForm.end) {
        alert("Ruangan, Tanggal, Jam mulai & Jam selesai wajib diisi.");
        return;
      }
      if (slotForm.start >= slotForm.end) {
        alert("Jam mulai harus lebih awal dari jam selesai.");
        return;
      }

      await adminCreateSlot(token, slotForm);
      alert("Slot ditambahkan.");
      setSlotForm((f) => ({ ...f, start: "10:00", end: "12:00", reason: "" }));
      loadSlotsPreview();
    } catch (e) {
      alert(e.message);
    }
  }

  // import { adminGetContact, adminUpdateContact } from "../../api";
  const [contactForm, setContactForm] = useState({ whatsapp: "", waMessage: "", instagram: "" });
  const [loadingContact, setLoadingContact] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const c = await adminGetContact(token);
        if (c) setContactForm({ whatsapp: c.whatsapp || "", waMessage: c.waMessage || "", instagram: c.instagram || "" });
      } catch (_) {}
      setLoadingContact(false);
    })();
  }, [token]);

  async function saveContact(e) {
    e.preventDefault();
    if (!/^\d{8,15}$/.test(contactForm.whatsapp)) {
      alert("Nomor WhatsApp harus format internasional tanpa '+', contoh 62852xxxxxxx");
      return;
    }
    try {
      await adminUpdateContact(token, contactForm);
      alert("Kontak diperbarui.");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
        <div className="font-bold text-orange-600">Voxpro Hub — Admin</div>
        <div className="text-sm">
          Login sebagai: <b>{user?.name}</b> ({user?.role})
        </div>
        <button onClick={logout} className="px-3 py-1 rounded bg-gray-800 text-white text-sm">
          Logout
        </button>
      </nav>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 pt-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm">Kelola data ruangan & ketersediaan.</p>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* ========== ROOMS SECTION ========== */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Rooms</h2>
          <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow hover:shadow-lg transition">
            + Tambah Room
          </button>
        </div>

        {/* Status / Error */}
        {err && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{err}</div>}

        {/* Tabel */}
        <div className="overflow-x-auto rounded-2xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-red-50">
              <tr>
                <th className="text-left px-4 py-3">Nama</th>
                <th className="text-left px-4 py-3">Kapasitas</th>
                <th className="text-left px-4 py-3">Harga/Jam</th>
                <th className="text-left px-4 py-3">Fasilitas</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={6}>
                    Memuat data...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={6}>
                    Belum ada data.
                  </td>
                </tr>
              ) : (
                rooms.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3">{r.capacity}</td>
                    <td className="px-4 py-3">Rp {Number(r.pricePerHour).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3">{Array.isArray(r.facilities) ? r.facilities.join(", ") : "-"}</td>
                    <td className="px-4 py-3">{r.isActive ? <span className="text-green-600 font-medium">Aktif</span> : <span className="text-gray-500">Nonaktif</span>}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEdit(r)} className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-50">
                        Edit
                      </button>
                      <button onClick={() => removeRoom(r.id)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Tambah/Edit */}
        <Modal open={openModal} onClose={() => setOpenModal(false)} title={titleModal}>
          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nama</label>
              <input className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Kapasitas</label>
                <input type="number" min="1" className="w-full border rounded-lg px-3 py-2" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm mb-1">Harga/jam (Rp)</label>
                <input type="number" min="0" className="w-full border rounded-lg px-3 py-2" value={form.pricePerHour} onChange={(e) => setForm((f) => ({ ...f, pricePerHour: e.target.value }))} required />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Fasilitas (pisahkan dengan koma)</label>
              <input className="w-full border rounded-lg px-3 py-2" placeholder="AC, Projector, WiFi" value={form.facilities} onChange={(e) => setForm((f) => ({ ...f, facilities: e.target.value }))} />
            </div>

            <div className="flex items-center gap-2">
              <input id="isActive" type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4" />
              <label htmlFor="isActive" className="text-sm">
                Aktif
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpenModal(false)} className="px-4 py-2 rounded border">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700">
                {editing ? "Simpan Perubahan" : "Simpan"}
              </button>
            </div>
          </form>
        </Modal>

        {/* ========== AVAILABILITY SECTION ========== */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Ketersediaan (Blokir Jadwal)</h2>
          </div>

          <form onSubmit={submitSlot} className="grid md:grid-cols-5 gap-3 bg-white border rounded-2xl p-4">
            <select className="border rounded-lg px-3 py-2" value={slotForm.roomId} onChange={(e) => setSlotForm((f) => ({ ...f, roomId: e.target.value }))}>
              <option value="">Pilih Ruangan</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <input type="date" className="border rounded-lg px-3 py-2" value={slotForm.date} onChange={(e) => setSlotForm((f) => ({ ...f, date: e.target.value }))} />

            <input type="time" className="border rounded-lg px-3 py-2" value={slotForm.start} onChange={(e) => setSlotForm((f) => ({ ...f, start: e.target.value }))} />

            <input type="time" className="border rounded-lg px-3 py-2" value={slotForm.end} onChange={(e) => setSlotForm((f) => ({ ...f, end: e.target.value }))} />

            <input placeholder="Alasan (opsional)" className="border rounded-lg px-3 py-2" value={slotForm.reason} onChange={(e) => setSlotForm((f) => ({ ...f, reason: e.target.value }))} />

            <div className="md:col-span-5 flex justify-end">
              <button className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700">+ Tambah Slot</button>
            </div>
          </form>

          <div className="mt-4 bg-white border rounded-2xl p-4">
            <div className="font-medium mb-2">Slot tidak tersedia (preview)</div>
            {!slotForm.roomId || !slotForm.date ? (
              <div className="text-sm text-gray-500">Pilih ruangan & tanggal untuk melihat slot.</div>
            ) : loadingSlots ? (
              <div className="text-sm text-gray-500">Memuat slot…</div>
            ) : slotsPreview.length === 0 ? (
              <div className="text-sm text-gray-600">Belum ada slot terblokir.</div>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-2">
                {slotsPreview.map((s) => (
                  <li key={s.id} className="text-sm bg-orange-50 border border-orange-200 rounded px-3 py-2 flex items-center justify-between">
                    <span>
                      {s.start}–{s.end} {s.reason && `• ${s.reason}`}
                    </span>
                    {/* Jika ingin hapus slot langsung dari preview, aktifkan tombol di bawah + import adminDeleteSlot */}
                    {/* <button
                      onClick={async () => {
                        if (!confirm('Hapus slot ini?')) return;
                        try { await adminDeleteSlot(token, s.id); loadSlotsPreview(); }
                        catch (e) { alert(e.message); }
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button> */}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-gray-500 mt-4">* Slot terblokir akan tampil di halaman Booking dan mencegah user memilih jam yang tabrakan.</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Pengaturan Kontak</h2>
          {loadingContact ? (
            <div className="text-sm text-gray-500">Memuat...</div>
          ) : (
            <form onSubmit={saveContact} className="grid md:grid-cols-3 gap-4 bg-white border rounded-2xl p-4">
              <div className="md:col-span-1">
                <label className="block text-sm mb-1">Nomor WhatsApp</label>
                <input className="w-full border rounded-lg px-3 py-2" placeholder="62852xxxxxxx" value={contactForm.whatsapp} onChange={(e) => setContactForm((f) => ({ ...f, whatsapp: e.target.value.replace(/\s+/g, "") }))} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Template Pesan</label>
                <input className="w-full border rounded-lg px-3 py-2" placeholder="Halo Voxpro Hub, saya ingin booking." value={contactForm.waMessage} onChange={(e) => setContactForm((f) => ({ ...f, waMessage: e.target.value }))} />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm mb-1">Instagram</label>
                <input className="w-full border rounded-lg px-3 py-2" placeholder="@voxprohub" value={contactForm.instagram} onChange={(e) => setContactForm((f) => ({ ...f, instagram: e.target.value }))} />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700">Simpan</button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
