import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Assets
import image13 from "./assets/image13.png";
import image14 from "./assets/image14.png";
import image133 from "./assets/image13-3.png";
import line39 from "./assets/line39.png";
import fasilitas1 from "./assets/fasilitas1.png";
import fasilitas2 from "./assets/fasilitas2.png";
import fasilitas3 from "./assets/fasilitas3.png";
import kontak1 from "./assets/kontak1.png";
import SHAPEGradasi from "./assets/shape-gradasi.png";

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const logoRef = useRef(null);

  // menu yang scroll ke section
  const NAV = [
    { label: "Beranda", id: "beranda" },
    { label: "Fasilitas", id: "fasilitas" },
    { label: "Kontak", id: "kontak" },
  ];

  const NAVBAR_OFFSET = 80; // kira-kira tinggi navbar saat sticky

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white text-gray-800 overflow-x-hidden font-[Poppins]">
      {/* === NAVBAR === */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scroll ? "bg-white/80 shadow-lg backdrop-blur-md py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={image14} alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10" />
            <h1 className="font-bold tracking-wide text-lg sm:text-xl md:text-2xl text-orange-600">VOXPRO HUB</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center font-medium text-gray-700">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className="hover:text-orange-500 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-orange-400 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </button>
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
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToId(item.id);
                  setOpen(false);
                }}
                className="hover:text-orange-600 transition"
              >
                {item.label}
              </button>
            ))}
            <Link to="/login" className="px-5 py-1.5 border border-orange-400 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition" onClick={() => setOpen(false)}>
              Masuk
            </Link>
            <Link to="/register" className="px-5 py-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition" onClick={() => setOpen(false)}>
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* === HERO / BERANDA === */}
      <section
        id="beranda"
        className="relative overflow-visible bg-white bg-no-repeat bg-[position:center_120%] bg-[length:140%_auto] md:bg-[position:center_115%] md:bg-[length:120%_auto] lg:bg-[position:center_110%] lg:bg-[length:100%_auto] scroll-mt-28"
        style={{ backgroundImage: `url(${SHAPEGradasi})` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6 md:px-10 pt-28 md:pt-36 pb-16 min-h-[100vh]">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-black [font-family:'Poppins-Bold',Helvetica] animate-fadeUp">Menciptakan ruang kolaborasi modern untuk ide, bisnis, dan karya kreatif Anda.</h2>
            <p className="text-lg md:text-xl text-gray-800 [font-family:'Poppins-Regular',Helvetica] animate-fadeUp">
              Dari meeting bisnis hingga produksi konten kreatif, Voxpro Hub hadir dengan ruang modern, fasilitas lengkap, dan suasana nyaman untuk mendukung produktivitas Anda.
            </p>
            <div className="relative inline-block">
              <span className="absolute inset-0 blur-[12px] rounded-full bg-black/10 translate-y-2" />
              <Link
                to="/booking"
                className="relative inline-flex items-center justify-center px-6 py-3 rounded-md bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg transition-transform hover:-translate-y-[2px] animate-fadeUp"
              >
                Booking Sekarang
              </Link>
            </div>
          </div>

          <div className="relative md:static">
            <div className="flex-1 hidden md:block sticky top-24">
              <img ref={logoRef} src={image133} alt="Logo Voxprohub" className="w-full max-w-sm md:max-w-md lg:max-w-xl object-contain drop-shadow-2xl will-change-transform transition-[filter] duration-200" />
            </div>
            <div className="md:hidden flex justify-center">
              <img src={image133} alt="Logo Voxprohub" className="w-full max-w-sm object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* === VISI === */}
      <section id="visi" className="bg-white py-16 text-center px-6 md:px-16 scroll-mt-28">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-playfair">Visi Kami</h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">Menjadi ruang kolaborasi paling efektif bagi kebutuhan meeting, produksi konten, dan acara profesional di Makassar.</p>
        <img src={line39} alt="Line" className="mx-auto w-3/4 sm:w-2/3 lg:w-1/2 h-1.5 object-cover mt-6 opacity-70" />
      </section>

      {/* === MAPS === */}
      <section id="maps" className="bg-gradient-to-r from-orange-100 to-yellow-50 py-16 px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center scroll-mt-28">
        <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-3xl shadow-2xl overflow-hidden">
          <iframe title="Lokasi Voxpro Hub" src="https://www.google.com/maps?q=Kedai%20Mantao%20Makassar&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Lokasi Ruangan</h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">Terletak di kawasan strategis dengan akses mudah, parkir luas, serta dikelilingi kafe dan ATM.</p>
          <a href="https://www.google.com/maps/place/Kedai+Mantao+Makassar" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-medium underline hover:text-orange-800 transition">
            Buka di Google Maps →
          </a>
        </div>
      </section>

      {/* === FASILITAS === */}
      <section id="fasilitas" className="bg-white py-16 text-center px-6 md:px-12 lg:px-20 scroll-mt-28">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 font-playfair tracking-wide">Fasilitas Kami</h2>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {[fasilitas1, fasilitas2, fasilitas3].map((img, i) => (
            <div key={i} className="bg-gradient-to-br from-orange-50 via-yellow-50 to-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 p-6 flex flex-col items-center">
              {/* Gambar Fasilitas */}
              <div className="relative overflow-hidden rounded-2xl mb-5 w-full">
                <img src={img} alt={`Fasilitas ${i + 1}`} className="w-full h-[200px] object-cover transform hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl"></div>
              </div>

              {/* Judul dan Deskripsi */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{["Studio", "Medium Room", "Small Room"][i]}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed px-2">
                {
                  [
                    "Cocok untuk podcast, livestream, atau produksi konten video dengan pencahayaan studio profesional.",
                    "Kapasitas 5–7 orang, ideal untuk diskusi tim kecil atau presentasi dengan proyektor modern.",
                    "Ruang nyaman untuk 2–3 orang, cocok untuk meeting privat, sesi kerja fokus, atau konsultasi.",
                  ][i]
                }
              </p>

              {/* Tombol Aksi */}
              <div className="mt-auto">
                <Link to="/detail-layanan" className="inline-block bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-2 rounded-full text-sm font-medium hover:scale-105 hover:shadow-lg transition-all duration-300">
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === KONTAK === */}
      <section id="kontak" className="relative bg-gradient-to-r from-orange-400 to-yellow-400 py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 text-white overflow-hidden scroll-mt-28">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-300/40 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300/40 rounded-full blur-3xl -z-10"></div>

        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h3 className="font-medium flex justify-center md:justify-start items-center gap-2 text-sm uppercase tracking-wider">
            <span className="block w-8 h-0.5 bg-white"></span> Hubungi Kami
          </h3>
          <h2 className="text-2xl sm:text-3xl font-bold leading-snug">Siap membantu Anda dalam pemesanan ruang atau kolaborasi bisnis</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-4">
            <a href="https://wa.me/6285242008058" target="_blank" rel="noopener noreferrer" className="bg-white text-orange-600 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-gray-100 flex items-center gap-2 transition">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" className="w-5 h-5" />
              Hubungi Kami
            </a>
            <p className="text-white text-sm">
              IG:{" "}
              <a href="https://www.instagram.com/voxprohub" className="underline hover:text-gray-100">
                @voxprohub
              </a>
            </p>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img src={kontak1} alt="Kontak" className="w-full max-w-xs sm:max-w-sm rounded-3xl drop-shadow-2xl hover:scale-105 transition duration-500" />
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-white pt-14 pb-8 px-6 md:px-16 border-t border-gray-200 mt-16 text-center md:text-left text-[13px] text-gray-600">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <img src={image14} alt="Logo" className="w-8 h-8" />
              <h2 className="font-bold text-lg text-orange-600">VOXPRO HUB</h2>
            </div>
            <p>
              Kedai Mantao Lt.2, Jl. Toddopuli Raya, <br /> Makassar, Sulawesi Selatan 90231
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-800 uppercase tracking-wide">Kontak</h3>
            <p>Marketing</p>
            <p>+62 812-3456-7890 (WA/Call)</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-800 uppercase tracking-wide">Navigasi</h3>
            {NAV.map((item) => (
              <button key={item.id} onClick={() => scrollToId(item.id)} className="block hover:text-orange-600 transition duration-200 text-left">
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Web Designer & Workspace Provider di Makassar | Voxpro Hub © {new Date().getFullYear()}</p>
          <p className="mt-2 max-w-3xl mx-auto">Voxpro Hub menyediakan layanan ruang kerja, studio kreatif, dan fasilitas meeting modern untuk mendukung kolaborasi Anda.</p>
        </div>
      </footer>
    </div>
  );
}
