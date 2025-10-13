import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // ========== 1️⃣ Seed admin ==========
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@voxprohub.local" },
    update: {},
    create: {
      name: "Admin Vox",
      email: "admin@voxprohub.local",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("✅ Seed admin dibuat: admin@voxprohub.local / admin123");

  // ========== 2️⃣ Seed Contact Info (nomor WA, IG, pesan default) ==========
  await prisma.contactInfo.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      whatsapp: "6285242008058",
      waMessage: "Halo Voxpro Hub, saya ingin booking ruangan.",
      instagram: "@voxprohub",
    },
  });
  console.log("✅ Seed contact info ditambahkan");

  // ========== 3️⃣ Seed 3 Room Default ==========
  const roomsPayload = [
    {
      name: "Meeting Room",
      capacity: 8,
      pricePerHour: 150000,
      facilities: ["AC", "Projector", "WiFi"],
    },
    {
      name: "Podcast Room",
      capacity: 4,
      pricePerHour: 200000,
      facilities: ["Acoustic Treatment", "Mic Pro", "Mixer"],
    },
    {
      name: "Small Room",
      capacity: 3,
      pricePerHour: 100000,
      facilities: ["AC", "WiFi"],
    },
  ];

  for (const r of roomsPayload) {
    await prisma.room.upsert({
      where: { name: r.name },
      update: {},
      create: { ...r, isActive: true },
    });
  }
  console.log(`✅ Seed rooms ditambahkan: ${roomsPayload.map((r) => r.name).join(", ")}`);
}

// Jalankan dan disconnect
main()
  .then(() => console.log("✅ Semua seed selesai"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
