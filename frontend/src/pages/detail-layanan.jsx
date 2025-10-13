import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Gambar
import podcastRoom from "../assets/podcast-room.png";
import creativeStudio from "../assets/creative-studio.png";
import smallRoom from "../assets/small-room.png";
import meetingRoom from "../assets/meeting-room.png";
import loungeArea from "../assets/lounge-area.png";
import image14 from "../assets/image14.png"; // logo

export default function DetailLayanan() {
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const layanan = [
    {
      id: 1,
      title: "Podcast Room",
      desc: "Ruang kedap suara eksklusif dengan mikrofon profesional, mixer audio, dan pencahayaan lembut. Ideal untuk kreator konten dan musisi yang ingin hasil suara jernih serta suasana tenang.",
      price: "Rp 120.000 / jam",
      image: podcastRoom,
    },
    {
      id: 2,
      title: "Creative Studio",
      desc: "Studio dengan pencahayaan adjustable, backdrop premium, dan area kerja fleksibel — sempurna untuk foto, video, atau brainstorming kreatif.",
      price: "Rp 150.000 / jam",
      image: creativeStudio,
    },
    {
      id: 3,
      title: "Lounge Area",
      desc: "Ruang santai dengan aroma kopi hangat dan ambience modern. Cocok untuk istirahat atau kerja santai dengan Wi-Fi cepat.",
      price: "Rp 50.000 / jam",
      image: loungeArea,
    },
    {
      id: 4,
      title: "Small Room",
      desc: "Ruang kerja mini dengan suasana privat dan nyaman. Dilengkapi meja ergonomis, colokan listrik, dan pencahayaan hangat untuk produktivitas maksimal.",
      price: "Rp 70.000 / jam",
      image: smallRoom,
    },
    {
      id: 5,
      title: "Meeting Room",
      desc: "Ruang rapat modern berkapasitas 6–10 orang dengan layar presentasi, papan tulis digital, dan koneksi Wi-Fi cepat. Cocok untuk diskusi profesional atau sesi pitching.",
      price: "Rp 180.000 / jam",
      image: meetingRoom,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-[Poppins]">
      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scroll
            ? "bg-white/80 shadow-md backdrop-blur-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={image14} alt="Logo" className="w-8 h-8" />
            <h1 className="font-bold text-lg text-orange-600">VOXPRO HUB</h1>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            {["Beranda", "Fasilitas", "Booking", "Kontak"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="hover:text-orange-500 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-orange-400 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Tombol Mobile */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Dropdown Mobile */}
        <div
          className={`md:hidden bg-white/90 backdrop-blur-md overflow-hidden transition-all duration-500 ${
            open ? "max-h-64 py-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-gray-700 font-medium text-sm">
            {["Beranda", "Fasilitas", "Booking", "Kontak"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="hover:text-orange-600 transition"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* === HEADER === */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pt-28 pb-12 px-6 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 text-white shadow-lg w-full rounded-b-3xl"
      >
        <h1 className="text-2xl md:text-3xl font-semibold mb-3 tracking-wide drop-shadow-sm">
          Fasilitas Modern & Estetik
        </h1>
        <p className="text-sm md:text-base font-light max-w-2xl mx-auto opacity-90">
          Ruang podcast, studio kreatif, dan lounge kami dirancang untuk ide besar dan kolaborasi brilian.
        </p>
      </motion.div>

      {/* === SHOWCASE (HORIZONTAL SLIDER) === */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <p className="text-center text-gray-500 text-sm mb-5 italic">
          Geser ke kanan untuk melihat fasilitas lainnya →
        </p>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory">
          {layanan.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 30px rgba(249,115,22,0.25)",
              }}
              className="min-w-[280px] md:min-w-[340px] bg-white rounded-2xl shadow-md hover:shadow-xl snap-center transition-all duration-300 border border-transparent hover:border-orange-300 hover:bg-gray-50"
            >
              <img
                src={item.image}
                alt={item.title}
                className="rounded-t-2xl h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-orange-600 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {item.desc}
                </p>
                <p className="text-gray-800 font-bold mb-3">{item.price}</p>
                <Link
                  to="/booking"
                  className="text-orange-500 font-medium text-sm hover:text-orange-600 transition"
                >
                  Pesan Sekarang →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === CTA === */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center py-14 px-6 bg-gradient-to-r from-gray-100 via-orange-50 to-gray-100 mt-10 rounded-t-[2.5rem] w-full shadow-inner"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mb-3">
          Siap Mewujudkan Ide Brilianmu?
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-5 max-w-xl mx-auto">
          Jadikan ruang kami sebagai tempat berkembangnya kreativitas dan kolaborasi tanpa batas.
        </p>
        <Link
          to="/booking"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-2.5 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all text-sm font-medium"
        >
          Mulai Pemesanan
        </Link>
      </motion.div>
    </div>
  );
}
