import React from "react";
import { useNavigate } from "react-router-dom";
import fasilitas1 from "../assets/fasilitas1.png";
import fasilitas2 from "../assets/fasilitas2.png";
import fasilitas3 from "../assets/fasilitas3.png";
import fasilitas4 from "../assets/fasilitas4.png";

export default function Fasilitas() {
  const navigate = useNavigate();

  const fasilitasList = [
    {
      img: fasilitas1,
      title: "Studio",
      desc: "Ruang profesional untuk podcast, shooting, dan live streaming. Dilengkapi dengan peralatan audio-video berkualitas tinggi dan pencahayaan estetik.",
    },
    {
      img: fasilitas2,
      title: "Meeting Room",
      desc: "Ruang rapat berdesain modern dan akustik baik. Ideal untuk diskusi tim, presentasi, atau konsultasi dengan suasana nyaman.",
    },
    {
      img: fasilitas3,
      title: "Medium Room",
      desc: "Ruang sedang dengan kapasitas 5–7 orang. Dilengkapi fasilitas lengkap seperti layar proyektor dan whiteboard digital.",
    },
    {
      img: fasilitas4,
      title: "Small Room",
      desc: "Ruang kecil dan privat untuk 2–3 orang. Cocok untuk meeting pribadi atau brainstorming singkat.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-50 flex flex-col items-center px-4 py-8 text-gray-800">
      {/* Tombol Kembali ke Landing Page */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm mb-4 transition-all"
      >
        ← Kembali ke Beranda
      </button>

      {/* Judul Halaman */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-2">
          Fasilitas Kami
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Kami menghadirkan ruang-ruang profesional yang dirancang untuk
          kenyamanan, kreativitas, dan produktivitas. Temukan ruang terbaik yang
          sesuai dengan kebutuhan aktivitasmu.
        </p>
      </div>

      {/* Grid Fasilitas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl w-full">
        {fasilitasList.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-44 object-cover transform hover:scale-105 transition duration-500"
            />
            <div className="p-5 text-center">
              <h3 className="text-lg font-semibold text-orange-600 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
