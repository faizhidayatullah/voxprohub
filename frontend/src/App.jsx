import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RequireRole } from "./routes/guards";

import LandingPage from "./landingPage";
import Beranda from "./landingPage";
import Fasilitas from "./pages/Fasilitas";
import Booking from "./pages/Booking";
import Kontak from "./pages/Kontak";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoomDetail from "./pages/RoomDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/fasilitas" element={<Fasilitas />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms/:slug" element={<RoomDetail />} />
          {/* Admin only */}
          <Route element={<RequireRole role="ADMIN" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
