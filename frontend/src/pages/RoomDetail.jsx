import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROOMS, getRoomBySlug } from "../data/rooms";

/* --- Ikon kecil tanpa lib tambahan --- */
const Icons = {
  wifi: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 20a2 2 0 100-4 2 2 0 000 4zm6.07-3.93a8 8 0 00-12.14 0l1.42 1.42a6 6 0 019.3 0l1.42-1.42zm3.54-3.53a13 13 0 00-19.22 0l1.42 1.41a11 11 0 0116.38 0l1.42-1.41zm3.51-3.49a18 18 0 00-26.76 0l1.42 1.41a16 16 0 0123.92 0l1.42-1.41z" />
    </svg>
  ),
  tv: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M3 5h18a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm0 2v9h18V7H3zm6 13h6v2H9v-2z" />
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zM11 19h2v3h-2v-3z" />
    </svg>
  ),
  ac: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M4 7h16a2 2 0 012 2v1H2V9a2 2 0 012-2zm-2 6h20v2a2 2 0 01-2 2h-6l2 2-1.4 1.4L12 18l-2.6 2.4L8 19l2-2H4a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  board: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M4 4h16v12H4zM2 18h20v2H2z" />
    </svg>
  ),
  cup: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18 7h3a2 2 0 010 4h-3v2a6 6 0 01-6 6 6 6 0 01-6-6V5h12v2zm0 2V7m3 2a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M9 16.2l-3.5-3.6L4 14l5 5 11-11-1.5-1.4z" />
    </svg>
  ),
};

export default function RoomDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const room = getRoomBySlug(slug);

  // Selalu mulai dari atas saat membuka/ganti room
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-gray-600 mb-4">Room tidak ditemukan.</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-gray-900 text-white rounded-full">
          Kembali
        </button>
      </div>
    );
  }

  const iconFor = (label) => {
    const t = label.toLowerCase();
    if (t.includes("wifi")) return Icons.wifi;
    if (t.includes("tv") || t.includes("monitor")) return Icons.tv;
    if (t.includes("mic") || t.includes("podcast")) return Icons.mic;
    if (t.includes("ac")) return Icons.ac;
    if (t.includes("white") || t.includes("board")) return Icons.board;
    if (t.includes("coffee") || t.includes("snack")) return Icons.cup;
    return Icons.check;
  };

  return (
    <div className="relative min-h-screen">
      {/* background tint dari room.color */}
      <div className={`${room.color} absolute inset-0`} />
      {/* overlay lembut */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.7),transparent_60%)]" />

      {/* ===== HERO ===== */}
      <header className="relative px-6 md:px-12 lg:px-20 pt-14 pb-10">
        <nav className="text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-800">
            Beranda
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{room.title}</span>
        </nav>

        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">{room.title}</h1>

        <p className="mt-3 text-gray-700 max-w-3xl leading-relaxed">{room.desc}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {room.useCases?.map((u) => (
            <span key={u} className="px-3 py-1 rounded-full bg-white/80 backdrop-blur border text-sm text-gray-800 shadow-sm">
              {u}
            </span>
          ))}
        </div>
      </header>

      {/* ===== MAIN (flex supaya baseline sejajar) ===== */}
      <main className="relative px-6 md:px-12 lg:px-20 pb-24">
        <div className="lg:flex lg:items-stretch lg:gap-10">
          {/* LEFT column */}
          <div className="lg:w-[60%] flex flex-col justify-between">
            {/* Foto */}
            <div className="overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-xl mb-6 flex-1">
              <img src={room.image} alt={room.title} className="w-full h-[420px] md:h-[520px] object-cover" />
            </div>

            {/* Sekilas Ruangan (lock min-height agar sejajar) */}
            <div className="bg-white rounded-2xl p-6 shadow-lg flex-shrink-0 min-h-[220px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sekilas Ruangan</h3>
              <ul className="grid sm:grid-cols-2 gap-3 text-gray-700">
                {room.useCases.map((u) => (
                  <li key={u} className="flex items-start gap-2">
                    <span className="mt-2 h-2 w-2 bg-orange-500 rounded-full" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT column */}
          <aside className="lg:w-[40%] lg:sticky lg:top-8 mt-8 lg:mt-0">
            <div className="bg-white rounded-3xl shadow-xl p-7 ring-1 ring-black/5 flex flex-col h-full">
              <h2 className="text-2xl font-semibold text-gray-900">Fasilitas yang Tersedia</h2>

              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-gray-700">
                {room.fasilitas.map((f) => (
                  <li key={f} className="flex items-center gap-2 rounded-xl px-3 py-2 bg-orange-50/70">
                    <span className="text-orange-600">{iconFor(f)}</span>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl bg-gradient-to-r from-orange-100 to-yellow-100 p-4 text-sm text-gray-800">*Bonus dokumentasi kegiatan (S&K berlaku).</div>

              <Link to={`/booking?room=${room.slug}`} className="mt-7 block w-full text-center rounded-full bg-gray-900 text-white font-semibold py-3 hover:opacity-95 active:translate-y-[1px] transition">
                Cek Ketersediaan & Booking
              </Link>

              <p className="mt-3 text-xs text-gray-500 text-center">Butuh bantuan memilih ruangan? Konsultasi gratis via admin.</p>
              <a
                href="https://wa.me/628xxxxxxx" // nomor admin VoxproHub
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 w-full text-sm font-medium text-orange-600 border border-orange-300 py-2.5 rounded-full hover:bg-orange-50 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2a10 10 0 00-9.95 11.3 10.07 10.07 0 001.4 3.75L2 22l5.2-1.4a9.9 9.9 0 004.8 1.25h.05A10 10 0 0012 2zm5.6 14.4a1 1 0 01-.45.6 6.73 6.73 0 01-3.05.85 9.47 9.47 0 01-4.25-1 7.73 7.73 0 01-2.7-2.3 5.93 5.93 0 01-1.2-2.05A5.6 5.6 0 016 10.5a.67.67 0 01.2-.55l.8-.75a.74.74 0 011-.05l.65.55a.66.66 0 01.2.7 2.62 2.62 0 00.1 2.25 4.78 4.78 0 001.85 1.85 3.84 3.84 0 002.1.55 1.22 1.22 0 00.55-.15.66.66 0 01.8.2l.55.85a.64.64 0 01.05.65z" />
                </svg>
                Hubungi Admin via WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* ===== ROOM SWITCHER ===== */}
      <footer className="relative px-6 md:px-12 lg:px-20 pb-16 mt-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {ROOMS.map((r) => (
            <Link key={r.slug} to={`/rooms/${r.slug}`} className={`px-5 py-2.5 rounded-full border text-sm transition shadow-sm ${r.slug === room.slug ? "bg-gray-900 text-white" : "bg-white text-gray-900 hover:bg-gray-100"}`}>
              {r.title}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
