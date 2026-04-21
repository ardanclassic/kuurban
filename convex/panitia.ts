import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── QUERIES ──────────────────────────────────────────────

export const getPengurusHarian = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pengurus_harian").collect();
  },
});

export const getDivisiPanitia = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("divisi_panitia").collect();
  },
});

// ── PENGURUS HARIAN MUTATIONS ────────────────────────────

export const createPengurus = mutation({
  args: {
    nama: v.string(),
    jabatan: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pengurus_harian", args);
  },
});

export const updatePengurus = mutation({
  args: {
    id: v.id("pengurus_harian"),
    nama: v.string(),
    jabatan: v.string(),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const removePengurus = mutation({
  args: { id: v.id("pengurus_harian") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ── DIVISI PANITIA MUTATIONS ─────────────────────────────

export const createDivisi = mutation({
  args: {
    nama: v.string(),
    koordinator: v.string(),
    anggota: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("divisi_panitia", args);
  },
});

export const updateDivisi = mutation({
  args: {
    id: v.id("divisi_panitia"),
    nama: v.string(),
    koordinator: v.string(),
    anggota: v.array(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const removeDivisi = mutation({
  args: { id: v.id("divisi_panitia") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
