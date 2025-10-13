import React from "react";
import { useNavigate } from "react-router-dom";
import rectangle169 from "../assets/kontak1.png";

export default function Beranda() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-50 to-orange-100 flex flex-col justify-center items-center text-center text-gray-800 px-6 relative font-[Poppins]">
       {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 text-orange-600 px-3 py-1.5 rounded-full shadow-sm text-sm font-medium hover:bg-orange-100 hover:scale-105 transition-all duration-200"
      >
        <span className="text-base">←</span> Kembali ke Beranda
      </button>

      {/* Konten */}
      <h1 className="text-3xl md:text-4xl font-bold drop-shadow-sm text-gray-900">
        Selamat Datang di <span className="text-orange-600">Voxpro Hub</span>
      </h1>
      <p className="mt-6 text-base md:text-lg max-w-3xl leading-relaxed text-gray-700">
        <strong>Voxpro Hub</strong> adalah perusahaan penyedia ruang kerja dan ruang
        kreatif di Kota Makassar. Kami menghadirkan solusi bagi individu dan
        bisnis untuk berkolaborasi, berkreasi, dan berinovasi dalam suasana modern
        dan nyaman.
      </p>

      <img
        src={rectangle169}
        alt="Voxpro Hub"
        className="mt-10 rounded-2xl shadow-xl w-full max-w-3xl object-cover border-4 border-white/50"
      />
    </div>
  );
}
