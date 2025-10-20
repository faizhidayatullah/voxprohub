import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import image14 from "../assets/image14.png";
import { API_BASE } from "../api";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;

const pad2 = (n) => String(n).padStart(2, "0");
const toIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

// konversi "HH:MM" -> menit
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// cek overlap rentang waktu [s1, e1) dan [s2, e2)
const isOverlap = (s1, e1, s2, e2) => s1 < e2 && e1 > s2;

export default function Booking() {
  const navigate = useNavigate();

  // NAVBAR
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // state ruangan & kontak
  const [rooms, setRooms] = useState([]);
  const [contact, setContact] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  // kalender state
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth()); // 0..11
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null); // number (1..31)

  // indikator hari (bukan disabled penuh)
  const [dayStatusMap, setDayStatusMap] = useState({}); // {dayNumber: 'hasSlot'|'available'}

  // waktu & durasi untuk satu entri yang akan ditambahkan
  const [selectedTime, setSelectedTime] = useState(""); // "HH:mm"
  const [duration, setDuration] = useState(2); // jam integer
  const [fullDay, setFullDay] = useState(false); // toggle seharian

  const [name, setName] = useState(""); // optional untuk WA

  // slots untuk hari terpilih
  const [dayBlockedSlots, setDayBlockedSlots] = useState([]); // [{id,date,start,end,reason}]

  // daftar pilihan multi-day {dateISO, start, end}
  const [selections, setSelections] = useState([]);

  // consts UI
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // ambil rooms & contact
  useEffect(() => {
    (async () => {
      const r = await fetch(`${API_BASE}/rooms`).then((x) => x.json());
      setRooms(r || []);
      const c = await fetch(`${API_BASE}/contact`).then((x) => x.json());
      setContact(c || null);
    })();
  }, []);

  // default pilih Meeting Room kalau ada
  useEffect(() => {
    if (rooms.length && !selectedRoomId) {
      const pref = rooms.find((x) => x.name.toLowerCase().includes("meeting")) || rooms[0];
      setSelectedRoomId(pref.id);
    }
  }, [rooms, selectedRoomId]);

  // tools kalender
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [month, year]);
  const monthStr = useMemo(() => `${year}-${pad2(month + 1)}`, [month, year]);
  const isoDate = useMemo(() => {
    if (!selectedDate) return "";
    return `${monthStr}-${pad2(selectedDate)}`;
  }, [selectedDate, monthStr]);

  // jam buka → list timeslot per 1 jam
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = OPEN_HOUR; h <= CLOSE_HOUR - 1; h++) {
      slots.push(`${pad2(h)}:00`);
    }
    return slots;
  }, []);

  // Ambil slot terblokir utk seluruh bulan → buat peta status hari
  useEffect(() => {
    async function loadMonthStatus() {
      if (!selectedRoomId) return;
      const start = `${year}-${pad2(month + 1)}-01`;
      const end = `${year}-${pad2(month + 1)}-${pad2(daysInMonth)}`;
      const arr = await fetch(`${API_BASE}/rooms/${selectedRoomId}/unavailable-range?start=${start}&end=${end}`).then((r) => r.json());

      // hanya indikator "hasSlot"
      const map = {};
      arr.forEach((s) => {
        const d = new Date(s.date);
        const day = d.getDate();
        map[day] = "hasSlot";
      });
      setDayStatusMap(map);
    }
    loadMonthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoomId, month, year, daysInMonth]);

  // Ambil slot terblokir utk hari terpilih
  useEffect(() => {
    async function loadDaySlots() {
      if (!selectedRoomId || !isoDate) {
        setDayBlockedSlots([]);
        return;
      }
      const arr = await fetch(`${API_BASE}/rooms/${selectedRoomId}/unavailable?date=${isoDate}`).then((r) => r.json());
      setDayBlockedSlots(arr || []);
    }
    loadDaySlots();
  }, [selectedRoomId, isoDate]);

  const selectedRoom = useMemo(() => rooms.find((r) => r.id === selectedRoomId), [rooms, selectedRoomId]);

  // hitung endTime sesuai fullDay / duration
  const endTime = useMemo(() => {
    if (!selectedDate) return "";
    if (fullDay) return `${pad2(CLOSE_HOUR)}:00`;
    if (!selectedTime) return "";
    const [H, M] = selectedTime.split(":").map(Number);
    const eH = H + Number(duration);
    return `${pad2(eH)}:${pad2(M)}`;
  }, [selectedDate, selectedTime, duration, fullDay]);

  // cek overlap dg slot terblokir (untuk validasi entri aktif)
  const currentOverlap = useMemo(() => {
    if (!isoDate) return false;
    const start = fullDay ? `${pad2(OPEN_HOUR)}:00` : selectedTime;
    const end = endTime;
    if (!start || !end) return false;
    const s1 = toMin(start);
    const e1 = toMin(end);
    return dayBlockedSlots.some((s) => isOverlap(s1, e1, toMin(s.start), toMin(s.end)));
  }, [isoDate, selectedTime, endTime, fullDay, dayBlockedSlots]);

  // cek overlap dengan selections yang sudah ada (tanggal & jam sama)
  const overlapWithSelections = useMemo(() => {
    if (!isoDate || !selectedRoomId) return false;
    const start = fullDay ? `${pad2(OPEN_HOUR)}:00` : selectedTime;
    const end = endTime;
    if (!start || !end) return false;
    const s1 = toMin(start);
    const e1 = toMin(end);

    return selections.some((sel) => {
      if (sel.dateISO !== isoDate) return false;
      if (sel.roomId !== selectedRoomId) return false; // ⬅️ hanya ruangan yang sama
      return isOverlap(s1, e1, toMin(sel.start), toMin(sel.end));
    });
  }, [isoDate, selectedTime, endTime, fullDay, selections, selectedRoomId]);

  // cek apakah start jam tertentu (1 jam) bentrok, untuk DISABLE tombol jam
  const isHourStartBlocked = (startHH) => {
    if (fullDay) return true;
    if (!selectedDate) return true;

    const s1 = toMin(startHH);
    const e1 = s1 + 60;

    // bentrok dengan slot terblokir dari backend (sudah per-room)
    const byBlocked = dayBlockedSlots.some((s) => isOverlap(s1, e1, toMin(s.start), toMin(s.end)));
    if (byBlocked) return true;

    // bentrok dengan pilihan yang SUDAH ditambahkan untuk ruangan & tanggal yang sama
    const byPicked = selections.some((sel) => sel.roomId === selectedRoomId && sel.dateISO === isoDate && isOverlap(s1, e1, toMin(sel.start), toMin(sel.end)));
    return byPicked;
  };

  // UI helpers status warna hari
  const getDayCellClass = (day) => {
    const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const hasSlot = dayStatusMap[day] === "hasSlot";
    if (isPast) return "bg-gray-100 text-gray-400 cursor-not-allowed";
    if (hasSlot) return "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100";
    return "bg-green-50 text-green-800 border border-green-200 hover:bg-green-100";
  };

  function handlePrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else setMonth((prev) => prev - 1);
    setSelectedDate(null);
    setSelectedTime("");
  }
  function handleNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else setMonth((prev) => prev + 1);
    setSelectedDate(null);
    setSelectedTime("");
  }

  function prettyDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Tambah ke daftar pilihan (multi-day)
  function addSelection() {
    if (!selectedRoom) return alert("Pilih ruangan dulu.");
    if (!isoDate) return alert("Pilih tanggal dulu.");

    const start = fullDay ? `${pad2(OPEN_HOUR)}:00` : selectedTime;
    const end = endTime;

    if (!start || !end) {
      return alert(fullDay ? "Gagal menentukan jam seharian." : "Pilih waktu mulai & durasi.");
    }

    if (currentOverlap) {
      return alert("Jam yang dipilih bertabrakan dengan slot terblokir.");
    }
    if (overlapWithSelections) {
      return alert("Jam ini bentrok dengan pilihan yang sudah ada pada tanggal yang sama di ruangan ini.");
    }

    const newSel = {
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      pricePerHour: Number(selectedRoom.pricePerHour),
      dateISO: isoDate,
      start,
      end,
      fullDay,
    };

    setSelections((prev) => [...prev, newSel]);

    // reset untuk input berikutnya
    setSelectedDate(null);
    setSelectedTime("");
    setFullDay(false);
  }

  function removeSelection(idx) {
    setSelections((prev) => prev.filter((_, i) => i !== idx));
  }

  // total biaya
  const totalPrice = useMemo(() => {
    return selections.reduce((sum, sel) => {
      const hours = sel.fullDay ? CLOSE_HOUR - OPEN_HOUR : (toMin(sel.end) - toMin(sel.start)) / 60;
      return sum + sel.pricePerHour * hours;
    }, 0);
  }, [selections]);

  async function onWhatsApp() {
    if (!contact?.whatsapp) return alert("Kontak WhatsApp belum diatur admin.");
    if (!selectedRoom) return alert("Pilih ruangan dulu.");
    if (selections.length === 0) return alert("Tambahkan minimal satu tanggal.");

    // compose list
    const lines = selections.map((s, i) => `${i + 1}. ${s.roomName} • ${prettyDate(s.dateISO)} (${s.dateISO}) • ${s.fullDay ? `${pad2(OPEN_HOUR)}:00-${pad2(CLOSE_HOUR)}:00 (seharian)` : `${s.start}-${s.end}`}`).join("\n");

    const msg = [
      contact.waMessage || "Halo Voxpro Hub, saya ingin booking.",
      "",
      `Nama: ${name || "-"}`,
      "",
      "Detail Pemesanan:",
      lines,
      "",
      `Estimasi Total: ${toIDR(totalPrice)}`,
      "",
      "Catatan: ",
      "",
      "Mohon konfirmasinya ya. Terima kasih! 🙏",
    ].join("\n");

    // log lead (opsional)
    fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "booking_page_whatsapp",
        note: `room=${selectedRoom.name};dates=${selections.map((s) => `${s.dateISO} ${s.start}-${s.end}`).join(",")}`,
      }),
    }).catch(() => {});

    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-50 to-orange-100 flex flex-col items-center px-4 py-10 font-[Poppins]">
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scroll ? "bg-white/80 shadow-lg backdrop-blur-md py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={image14} alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10" />
            <h1 className="font-bold tracking-wide text-lg sm:text-xl md:text-2xl text-orange-600">VOXPRO HUB</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center font-medium text-gray-700">
            {["Beranda"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="hover:text-orange-500 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-orange-400 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </Link>
            ))}
            <div className="flex gap-3 ml-4">
              <Link to="/login" className="px-4 py-1.5 text-sm rounded-full border border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white transition duration-300">
                Masuk
              </Link>
              <Link to="/register" className="px-4 py-1.5 text-sm rounded-full bg-orange-500 text-white hover:bg-orange-600 shadow-md transition duration-300">
                Daftar
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className={`md:hidden bg-white/90 backdrop-blur-md overflow-hidden transition-all duration-500 ${open ? "max-h-80 py-5" : "max-h-0"}`}>
          <div className="flex flex-col items-center gap-3 text-gray-700 font-medium text-sm">
            {["Beranda", "Fasilitas", "Booking", "Kontak"].map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} onClick={() => setOpen(false)} className="hover:text-orange-600 transition">
                {item}
              </Link>
            ))}
            <Link to="/login" className="px-5 py-1.5 border border-orange-400 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition">
              Masuk
            </Link>
            <Link to="/register" className="px-5 py-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* KONTEN */}
      <div className="mt-28 bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg w-full max-w-6xl p-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 border border-orange-100">
        {/* Kolom kiri: Jadwal & Input */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-orange-200 pb-2">Jadwal Booking</h2>

          {/* Pilih Ruangan */}
          <div className="mb-4">
            <label className="text-xs text-gray-700">Pilih Ruangan</label>
            <select
              value={selectedRoomId}
              onChange={(e) => {
                setSelectedRoomId(e.target.value);
                setSelectedDate(null);
                setSelectedTime("");
                setFullDay(false);
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} • Kap {r.capacity} • {toIDR(r.pricePerHour)}/jam
                </option>
              ))}
            </select>
          </div>

          {/* Kalender */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-4 mb-3">
              <button onClick={handlePrevMonth} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-200 transition-all text-xs">
                &lt;
              </button>
              <span className="text-sm font-medium text-gray-800">
                {months[month]} {year}
              </span>
              <button onClick={handleNextMonth} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-200 transition-all text-xs">
                &gt;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-gray-600 text-xs font-semibold mb-1">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const className = ["py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border", getDayCellClass(day), selectedDate === day ? "ring-2 ring-orange-300 scale-105" : "", isPast ? "opacity-60" : ""].join(" ");

                return (
                  <button key={day} onClick={() => !isPast && setSelectedDate(day)} disabled={isPast} className={className} title={dayStatusMap[day] === "hasSlot" ? "Ada beberapa jam terblokir hari ini" : "Semua jam tersedia"}>
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Keterangan status */}
            <div className="flex justify-center gap-6 mt-4 text-xs text-gray-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-green-500 rounded-sm"></span> Available
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-orange-400 rounded-sm"></span> Ada slot terblokir
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-gray-400 rounded-sm"></span> Tanggal lewat
              </div>
            </div>
          </div>

          {/* Pilih Waktu */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-800 font-medium text-xs mb-2">Pilih Waktu:</p>
              <label className={`text-xs flex items-center gap-2 ${fullDay ? "text-orange-600 font-semibold" : "text-gray-700"}`}>
                <input
                  type="checkbox"
                  checked={fullDay}
                  onChange={(e) => {
                    setFullDay(e.target.checked);
                    if (e.target.checked) setSelectedTime("");
                  }}
                />
                Seharian ({pad2(OPEN_HOUR)}:00–{pad2(CLOSE_HOUR)}:00)
              </label>
            </div>

            {!fullDay && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((t) => {
                    const disabled = isHourStartBlocked(t);
                    const isSelected = selectedTime === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        disabled={disabled}
                        className={[
                          "py-1.5 rounded-lg text-xs font-medium transition-all",
                          disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : isSelected ? "bg-orange-500 text-white scale-105 shadow-md" : "bg-gray-100 hover:bg-orange-100 text-gray-700",
                        ].join(" ")}
                        title={disabled && selectedDate ? "Jam ini sudah terblokir / sudah dipilih" : "Tersedia"}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                {/* Durasi */}
                <div className="mt-4">
                  <p className="text-gray-800 font-medium text-xs mb-1">Durasi (jam):</p>
                  <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} disabled={!selectedTime} className="border rounded-lg px-3 py-2 text-sm">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Slot terblokir hari ini */}
          <div className="bg-white rounded-xl border p-3 mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Jadwal Tidak Tersedia (hari terpilih)</div>
            {!selectedDate ? (
              <div className="text-xs text-gray-500">Pilih tanggal untuk melihat slot terblokir.</div>
            ) : dayBlockedSlots.length === 0 ? (
              <div className="text-xs text-gray-600">Semua jam tersedia hari ini.</div>
            ) : (
              <ul className="space-y-1">
                {dayBlockedSlots.map((s) => (
                  <li key={s.id} className="text-xs text-black bg-orange-100 border border-orange-200 rounded px-2 py-1">
                    {s.start}–{s.end} {s.reason ? `• ${s.reason}` : ""}
                  </li>
                ))}
              </ul>
            )}
            {selectedDate && (currentOverlap || overlapWithSelections) && <div className="mt-2 text-xs text-red-600">Waktu yang dipilih bertabrakan—silakan pilih jam lain.</div>}
          </div>

          {/* Tombol tambah ke daftar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            {/* Input Nama di kiri */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nama Lengkap (opsional)"
                className="h-11 w-full border border-gray-300 rounded-xl pl-3 pr-16 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-300 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">opsional</span>
            </div>

            {/* Tombol Tambah ke Daftar di kanan */}
            <button
              onClick={addSelection}
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold shadow hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!selectedRoom || !selectedDate || (fullDay ? false : !selectedTime) || currentOverlap || overlapWithSelections}
              title="Tambah tanggal & jam ini ke daftar"
            >
              {/* ikon plus */}
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Tambah ke Daftar
            </button>
          </div>
        </div>

        {/* Kolom kanan: Ringkasan multi-day & WhatsApp */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-orange-200 pb-2">Ringkasan & Daftar Pilihan</h2>

          {/* Daftar pilihan */}
          <div className="bg-white rounded-xl border p-3 mb-4">
            {selections.length === 0 ? (
              <div className="text-xs text-gray-500">
                Belum ada pilihan. Tambahkan tanggal & jam, lalu klik <b>“ Tambah ke Daftar ”</b>.
              </div>
            ) : (
              <ul className="space-y-2">
                {selections.map((s, idx) => (
                  <li key={`${s.roomId}-${s.dateISO}-${s.start}-${s.end}-${idx}`} className="text-xs bg-orange-50 border border-orange-200 rounded px-2 py-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{s.roomName}</div>
                      <div className="text-gray-700">
                        {prettyDate(s.dateISO)} <span className="text-gray-500">({s.dateISO})</span>
                      </div>
                      <div className="text-gray-700">{s.fullDay ? `${pad2(OPEN_HOUR)}:00–${pad2(CLOSE_HOUR)}:00 (Seharian)` : `${s.start}–${s.end}`}</div>
                    </div>

                    <button onClick={() => removeSelection(idx)} className="text-red-600 hover:underline">
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Estimasi biaya total */}
          <div className="text-gray-700 mb-4 bg-orange-50 rounded-xl p-3 shadow-sm text-xs">
            <p className="mt-1">
              Ruangan: <b>{selectedRoom ? selectedRoom.name : "-"}</b>
            </p>
            <p className="mt-1">
              Estimasi Total: <b>{selectedRoom ? toIDR(totalPrice) : "-"}</b>
            </p>
          </div>

          {/* Tombol WA */}
          <button
            onClick={onWhatsApp}
            className="mt-2 w-full py-2 text-sm bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold rounded-lg shadow hover:shadow-md hover:scale-[1.03] transition-all disabled:opacity-60"
            disabled={!selectedRoom || selections.length === 0}
          >
            Chat via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
