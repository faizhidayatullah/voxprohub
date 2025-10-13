import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image14 from "../assets/image14.png"; // Logo Voxpro Hub

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi dasar
    if (!name || !email || !password || !confirmPassword) {
      setError("Semua kolom wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar.");

      alert("Pendaftaran berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center px-4">
      {/* Card Register */}
      <div className="bg-white/95 rounded-2xl shadow-2xl p-10 w-full max-w-md relative">
        {/* Tombol Kembali */}
        <button onClick={() => navigate("/")} className="absolute top-4 left-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition">
          <i className="fas fa-arrow-left"></i>
          <span className="text-sm font-semibold">Kembali</span>
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 mt-6">
          <img src={image14} alt="Logo Voxpro Hub" className="w-16 h-16 mb-3" />
          <h1 className="text-3xl font-bold text-orange-600 tracking-wide">VOXPRO HUB</h1>
          <p className="text-gray-600 text-sm mt-1">Buat akun baru untuk melanjutkan</p>
        </div>

        {/* Form Register */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nama Lengkap" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" value={name} onChange={(e) => setName(e.target.value)} />

          <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />

          <input type="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />

          <input
            type="password"
            placeholder="Konfirmasi Password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Pesan error */}
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:-translate-y-1 disabled:opacity-60">
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        {/* Link ke Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <button onClick={() => navigate("/login")} className="text-orange-600 hover:underline font-semibold">
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
}
