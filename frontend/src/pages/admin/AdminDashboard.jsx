import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE, adminListRooms, adminCreateRoom, adminUpdateRoom, adminDeleteRoom, adminCreateSlot, adminDeleteSlot, adminGetContact, adminUpdateContact, getLanding, adminUpdateLanding, adminUploadImage } from "../../api";

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

function SidebarItem({ active, label, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl transition relative
      ${active ? "bg-orange-50 text-orange-700 font-medium" : "hover:bg-gray-50 text-gray-700"}`}
    >
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full
        ${active ? "bg-orange-500" : "bg-transparent group-hover:bg-gray-200"}`}
      />
      <span className="w-5 h-5">
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}

/* =========================
   Landing Editor Component
   ========================= */
function LandingEditor({ token }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    visiTitle: "",
    visiText: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getLanding();
        if (data) {
          setForm({
            heroTitle: data.heroTitle || "",
            heroSubtitle: data.heroSubtitle || "",
            heroImage: data.heroImage || "",
            visiTitle: data.visiTitle || "",
            visiText: data.visiText || "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateLanding(token, form);
      alert("Konten landing disimpan.");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminUploadImage(token, file);
      setForm((f) => ({ ...f, heroImage: url }));
    } catch (e) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <div className="text-sm text-gray-500">Memuat konten…</div>;

  return (
    <form onSubmit={onSave} className="space-y-4 bg-white border rounded-2xl p-4">
      <div className="grid md:grid-cols-[1fr_260px] gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Judul Utama (Hero Title)</label>
            <input className="w-full border rounded-lg px-3 py-2" value={form.heroTitle} onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))} placeholder="Menciptakan ruang kolaborasi modern..." required />
          </div>
          <div>
            <label className="block text-sm mb-1">Subjudul (Hero Subtitle)</label>
            <textarea
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
              value={form.heroSubtitle}
              onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
              placeholder="Dari meeting bisnis hingga produksi konten kreatif..."
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Gambar Hero</label>
            <div className="flex items-center gap-3">
              <input type="text" className="flex-1 border rounded-lg px-3 py-2" placeholder="https://... (opsional)" value={form.heroImage} onChange={(e) => setForm((f) => ({ ...f, heroImage: e.target.value }))} />
              <label className="px-3 py-2 border rounded-lg cursor-pointer">
                <input type="file" className="hidden" onChange={onUpload} accept="image/*" />
                {uploading ? "Uploading..." : "Upload"}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">Bisa isi URL langsung atau upload file.</p>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
          {form.heroImage ? <img src={form.heroImage} alt="Hero" className="w-full h-48 object-cover" /> : <span className="text-gray-400 text-sm">Preview Image</span>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Judul Visi</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.visiTitle} onChange={(e) => setForm((f) => ({ ...f, visiTitle: e.target.value }))} placeholder="Visi Kami" />
        </div>
        <div>
          <label className="block text-sm mb-1">Deskripsi Visi</label>
          <textarea rows={3} className="w-full border rounded-lg px-3 py-2" value={form.visiText} onChange={(e) => setForm((f) => ({ ...f, visiText: e.target.value }))} placeholder="Menjadi ruang kolaborasi paling efektif..." />
        </div>
      </div>

      <div className="flex justify-end">
        <button disabled={saving} className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60">
          {saving ? "Menyimpan…" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
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
    facilities: "",
    isActive: true,
  });

  const titleModal = useMemo(() => (editing ? "Edit Room" : "Tambah Room"), [editing]);

  const TABS = ["Rooms", "Ketersediaan", "Kontak", "Landing"];
  const [active, setActive] = useState("Rooms");

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
    setForm({ name: "", capacity: "", pricePerHour: "", facilities: "", isActive: true });
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
      if (editing) await adminUpdateRoom(token, editing.id, payload);
      else await adminCreateRoom(token, payload);

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
  const [slotForm, setSlotForm] = useState({ roomId: "", date: "", start: "10:00", end: "12:00", reason: "" });
  const [slotsPreview, setSlotsPreview] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (rooms.length && !slotForm.roomId) {
      const meeting = rooms.find((r) => r.name === "Meeting Room") || rooms[0];
      if (meeting) setSlotForm((f) => ({ ...f, roomId: meeting.id }));
    }
  }, [rooms, slotForm.roomId]);

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

  // ================== CONTACT ==================
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

  /* ================== RENDER ================== */
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur border-b px-6 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-bold">V</div>
          <div className="font-bold text-orange-600">Voxpro Hub — Admin</div>
        </div>
        <div className="text-sm">
          Login sebagai: <b>{user?.name}</b> ({user?.role})
        </div>
        <button onClick={logout} className="px-3 py-1 rounded bg-gray-800 text-white text-sm">
          Logout
        </button>
      </nav>

      {/* Layout: Sidebar + Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-6">
        {/* Sidebar */}
        <aside className="md:sticky md:top-16 h-max bg-white border rounded-2xl p-4">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">Admin Panel</div>
          <ul className="space-y-1">
            <li>
              <SidebarItem label="Kelola Rooms" active={active === "Rooms"} onClick={() => setActive("Rooms")} />
            </li>
            <li>
              <SidebarItem
                label="Ketersediaan"
                active={active === "Ketersediaan"}
                onClick={() => setActive("Ketersediaan")}
                icon={
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                }
              />
            </li>
            <li>
              <SidebarItem
                label="Kontak"
                active={active === "Kontak"}
                onClick={() => setActive("Kontak")}
                icon={
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M21 15a4 4 0 0 1-4 4H9l-6 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
            </li>
            <li>
              <SidebarItem
                label="Landing Page"
                active={active === "Landing"}
                onClick={() => setActive("Landing")}
                icon={
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M3 12l9-9 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 21V9h6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
            </li>
          </ul>

          <a href="/" className="mt-6 inline-flex items-center justify-center w-full px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium">
            Kembali ke Landing Page
          </a>
        </aside>

        {/* Content */}
        <main className="space-y-8">
          {/* ===== ROOMS ===== */}
          {active === "Rooms" && (
            <>
              <header>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 text-sm">Kelola data ruangan & ketersediaan.</p>
              </header>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Rooms</h2>
                <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow hover:shadow-lg transition">
                  + Tambah Room
                </button>
              </div>

              {err && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{err}</div>}

              <div className="overflow-x-auto rounded-2xl border">
                <table className="min-w-full text-sm text-gray-800">
                  <thead className="bg-orange-50 text-gray-700 font-semibold">
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
            </>
          )}

          {/* ===== KETERSEDIAAN ===== */}
          {active === "Ketersediaan" && (
            <>
              <header>
                <h1 className="text-2xl font-bold text-gray-900">Ketersediaan (Blokir Jadwal)</h1>
                <p className="text-gray-600 text-sm">Buat slot tidak tersedia per ruangan & tanggal.</p>
              </header>

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
                      <li
                        key={s.id}
                        className="text-sm bg-orange-50 border border-orange-200 rounded px-3 py-2
                     flex items-center justify-between"
                      >
                        <span>
                          {s.start}–{s.end} {s.reason && `• ${s.reason}`}
                        </span>

                        <button
                          onClick={async () => {
                            if (!confirm("Hapus slot ini?")) return;
                            try {
                              await adminDeleteSlot(token, s.id);
                              await loadSlotsPreview();
                            } catch (e) {
                              alert(e.message);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 font-medium hover:underline transition"
                        >
                          Hapus
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="text-xs text-gray-500 mt-4">* Slot terblokir akan tampil di halaman Booking dan mencegah user memilih jam yang tabrakan.</p>
              </div>
            </>
          )}

          {/* ===== KONTAK ===== */}
          {active === "Kontak" && (
            <>
              <header>
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Kontak</h1>
                <p className="text-gray-600 text-sm">Nomor WhatsApp & template pesan untuk Booking.</p>
              </header>

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
            </>
          )}

          {/* ===== LANDING ===== */}
          {active === "Landing" && (
            <>
              <header>
                <h1 className="text-2xl font-bold text-gray-900">Landing Page</h1>
                <p className="text-gray-600 text-sm">Ubah teks & gambar hero + visi.</p>
              </header>
              <LandingEditor token={token} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
