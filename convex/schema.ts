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
  }),
});
