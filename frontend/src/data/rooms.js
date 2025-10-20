// src/data/rooms.js
import fasilitas1 from "../assets/fasilitas1.png"; // Podcast Room
import fasilitas2 from "../assets/fasilitas2.png"; // Meeting Room
import fasilitas3 from "../assets/fasilitas3.png"; // Small Room

export const ROOMS = [
  {
    slug: "podcast-room",
    title: "Podcast Room",
    image: fasilitas1,
    desc: `Ruangan nyaman, ber-AC, dengan kapasitas 2–3 orang. Didesain khusus untuk kebutuhan
    rekaman podcast atau produksi konten audio-visual profesional. Kamu hanya
    perlu datang membawa konsep — ruangan siap dipakai.`,
    useCases: ["Rekaman podcast", "Produksi konten audio / video", "Wawancara & bincang kreatif"],
    fasilitas: ["Peralatan lengkap (mic, mixer, monitor)", "Kursi & meja ergonomis", "Smart TV / Display monitor", "Teknisi onsite siap bantu", "Full AC & pencahayaan studio", "Wifi cepat"],
    color: "bg-[#F9E4D7]", // coklat muda
  },
  {
    slug: "meeting-room",
    title: "Meeting Room",
    image: fasilitas2,
    desc: `Ruangan nyaman, ber-AC, dengan kapasitas 6–10 orang yang dapat disesuaikan
    dengan kebutuhanmu. Cocok untuk berbagai kegiatan profesional seperti
    rapat, presentasi, hingga pelatihan kecil.`,
    useCases: ["Meeting bisnis & presentasi", "Bikin online / offline course", "Kelas privat / pelatihan kecil"],
    fasilitas: ["Wifi cepat", "Smart TV", "Full AC", "Whiteboard", "Stationery", "Air mineral", "Snack box / coffee break", "Lunch box (opsional)", "Layanan dokumentasi kegiatan"],
    color: "bg-[#E0F2F7]", // biru muda
  },
  {
    slug: "small-room",
    title: "Small Room",
    image: fasilitas3,
    desc: `Ruang minimalis dan ber-AC, cocok untuk 2–3 orang. Biasanya digunakan untuk
    meeting 1-on-1, konsultasi pribadi, atau sesi kerja fokus. Memberikan suasana
    yang tenang dan nyaman untuk berdiskusi.`,
    useCases: ["Meeting 1-on-1", "Konsultasi pribadi", "Kerja fokus"],
    fasilitas: ["Wifi cepat", "Full AC", "Kursi & meja ergonomis", "Pencahayaan hangat dan nyaman", "Dekor elegan dengan wallpaper premium"],
    color: "bg-[#F5DFA4]", // gold muda
  },
];

export const getRoomBySlug = (slug) => ROOMS.find((r) => r.slug === slug);
