import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /**
   * Tabel utama: Data shohibul kurban (peserta kurban)
   * Digunakan oleh: admin/kurban (CRUD) dan public/kurban (tampilan publik)
   */
  shohibul_kurban: defineTable({
    nama: v.string(),
    jenis: v.union(
      v.literal("Sapi Kelompok"),
      v.literal("Sapi Mandiri"),
      v.literal("Kambing")
    ),
    kelompok: v.optional(v.string()), // Hanya untuk Sapi Kelompok (contoh: "Kelompok 1")
    keterangan: v.optional(v.string()), // Catatan tambahan (contoh: "Atas nama alm. H. Salim")
  }).index("by_jenis", ["jenis"]),

  /**
   * Tabel notulensi rapat panitia
   * Digunakan oleh: admin/rapat (CRUD)
   */
  rapat: defineTable({
    title: v.string(),
    date: v.string(), // Format: "14 April 2026"
    status: v.union(
      v.literal("Final"),
      v.literal("Internal"),
      v.literal("Draft")
    ),
    fullDesc: v.string(),
    points: v.array(v.string()), // Poin-poin kesepakatan rapat
  }).index("by_status", ["status"]),

  /**
   * Tabel susunan pengurus harian (Inti)
   * Digunakan oleh: admin/panitia
   */
  pengurus_harian: defineTable({
    nama: v.string(),
    jabatan: v.string(),
  }),

  /**
   * Tabel divisi kerja panitia
   * Digunakan oleh: admin/panitia
   */
  divisi_panitia: defineTable({
    nama: v.string(),
    koordinator: v.string(),
    anggota: v.array(v.string()),
    jobDesc: v.optional(v.string()),
  }),
  /**
   * Tabel galeri: Foto & Video kegiatan
   * Digunakan oleh: admin/galeri (CRUD) dan public/galeri (tampilan)
   */
  galeri: defineTable({
    caption: v.optional(v.string()),
    url: v.string(), // Public R2 URL
    storageKey: v.string(), // R2 Key for deletion
    type: v.union(v.literal("image"), v.literal("video")),
    year: v.string(), // Contoh: "2024", "2025"
  }).index("by_year", ["year"]),

  /**
   * Tabel metadata album: Informasi cerita per tahun
   */
  album_metadata: defineTable({
    year: v.string(),
    title: v.string(),
    subtitle: v.string(),
    description: v.string(),
    coverUrl: v.optional(v.string()),
    coverStorageKey: v.optional(v.string()),
  }).index("by_year", ["year"]),
});

