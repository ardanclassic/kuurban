import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── QUERIES ──────────────────────────────────────────────

/** Ambil semua data shohibul kurban */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("shohibul_kurban").collect();
  },
});

/** Ambil berdasarkan jenis kurban */
export const getByJenis = query({
  args: {
    jenis: v.union(
      v.literal("Sapi Kelompok"),
      v.literal("Sapi Mandiri"),
      v.literal("Kambing")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("shohibul_kurban")
      .withIndex("by_jenis", (q) => q.eq("jenis", args.jenis))
      .collect();
  },
});

// ── MUTATIONS ─────────────────────────────────────────────

/** Tambah shohibul kurban baru */
export const create = mutation({
  args: {
    nama: v.string(),
    jenis: v.union(
      v.literal("Sapi Kelompok"),
      v.literal("Sapi Mandiri"),
      v.literal("Kambing")
    ),
    kelompok: v.optional(v.string()),
    keterangan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("shohibul_kurban", args);
  },
});

/** Update data shohibul kurban */
export const update = mutation({
  args: {
    id: v.id("shohibul_kurban"),
    nama: v.optional(v.string()),
    jenis: v.optional(
      v.union(
        v.literal("Sapi Kelompok"),
        v.literal("Sapi Mandiri"),
        v.literal("Kambing")
      )
    ),
    kelompok: v.optional(v.string()),
    keterangan: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

/** Hapus shohibul kurban */
export const remove = mutation({
  args: { id: v.id("shohibul_kurban") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
