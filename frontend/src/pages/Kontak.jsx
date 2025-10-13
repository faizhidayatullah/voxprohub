import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-50 to-orange-100 flex flex-col justify-center items-start px-8 md:px-24 text-gray-800 relative font-[Poppins]">
{/* Tombol Kembali */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 text-orange-600 px-3 py-1.5 rounded-full shadow-sm text-sm font-medium hover:bg-orange-100 hover:scale-105 transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Kembali ke Beranda</span>
      </button>

      {/* Konten Utama */}
      <div className="max-w-3xl mt-20 md:mt-0">
        {/* Garis kecil + Subjudul */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-[2px] bg-orange-400"></div>
          <p className="text-gray-700 font-medium text-lg">
            Yang Bisa Kami Bantu
          </p>
        </div>

        {/* Judul Besar */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug mb-6 drop-shadow-sm text-gray-900">
          Hubungi kami untuk pemesanan ruang, <br />
          pertanyaan fasilitas, atau kolaborasi bisnis
        </h1>

        {/* Tombol & Link Instagram */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <a
            href="https://wa.me/6285242008058"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-105"
          >
            <FaWhatsapp className="text-2xl" />
            Hubungi Kami
          </a>
          <p className="text-gray-700 text-lg">
            Ikuti akun{" "}
            <a
              href="https://instagram.com/voxprohub"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-orange-600 hover:text-orange-700"
            >
              @voxprohub
            </a>{" "}
            di Instagram
          </p>
        </div>
      </div>
    </div>
  );
}
