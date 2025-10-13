import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image14 from "../assets/image14.png"; // logo Voxpro Hub
import googleLogo from "../assets/google-logo.png"; // logo Google
import { useAuth } from "../context/AuthContext"; // gunakan AuthContext
import { apiLogin } from "../api"; // konektor ke backend

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email dan Password wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const data = await apiLogin(email, password); // 🔗 panggil backend
      login(data); // simpan ke context dan localStorage

      if (data.user.role === "ADMIN") {
        alert("Login sebagai Admin berhasil!");
        navigate("/admin");
      } else {
        alert("Login sebagai User berhasil!");
        navigate("/");
      }
    } catch (err) {
      alert(err.message || "Login gagal, periksa email & password!");
    } finally {
      setLoading(false);
    }
  };

  // Simulasi login Google (belum terhubung backend)
  const handleGoogleSignIn = () => {
    alert("Login dengan Google berhasil (simulasi)!");
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center px-4">
      {/* Card Login */}
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
          <p className="text-gray-600 text-sm mt-1">Silakan masuk ke akun Anda</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />

          <input type="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:-translate-y-1">
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">atau</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Tombol Google */}
        <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition shadow-sm">
          <img src={googleLogo} alt="Google Logo" className="w-5 h-5" />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>

        {/* Link Register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <button onClick={() => navigate("/register")} className="text-orange-600 hover:underline font-semibold">
            Daftar Sekarang
          </button>
        </p>
      </div>
    </div>
  );
}
