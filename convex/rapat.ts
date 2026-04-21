import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── QUERIES ──────────────────────────────────────────────

/** Ambil semua notulensi rapat, diurutkan dari terbaru */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rapat").collect();
  },
});

// ── MUTATIONS ─────────────────────────────────────────────

/** Buat notulensi rapat baru */
export const create = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    status: v.union(
      v.literal("Final"),
      v.literal("Internal"),
      v.literal("Draft")
    ),
    fullDesc: v.string(),
    points: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rapat", args);
  },
});

/** Update notulensi rapat */
export const update = mutation({
  args: {
    id: v.id("rapat"),
    title: v.optional(v.string()),
    date: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("Final"),
        v.literal("Internal"),
        v.literal("Draft")
      )
    ),
    fullDesc: v.optional(v.string()),
    points: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

/** Hapus notulensi rapat */
export const remove = mutation({
  args: { id: v.id("rapat") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
