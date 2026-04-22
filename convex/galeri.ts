import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getItems = query({
  args: { year: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.year) {
      return await ctx.db
        .query("galeri")
        .withIndex("by_year", (q) => q.eq("year", args.year!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("galeri").order("desc").collect();
  },
});

export const addItem = mutation({
  args: {
    caption: v.optional(v.string()),
    url: v.string(),
    storageKey: v.optional(v.string()),
    type: v.union(v.literal("image"), v.literal("video")),
    year: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("galeri", {
      caption: args.caption,
      url: args.url,
      storageKey: args.storageKey || "",
      type: args.type,
      year: args.year,
    });
  },
});

export const deleteItem = mutation({
  args: { id: v.id("galeri") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Item not found");
    await ctx.db.delete(args.id);
    return item.storageKey; // Kembalikan key untuk dihapus di R2 oleh server action
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("galeri"),
    caption: v.optional(v.string()),
    year: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      caption: args.caption,
      year: args.year,
    });
  },
});

// FUNCTIONS UNTUK METADATA ALBUM
export const getAlbumMetadata = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("album_metadata").collect();
  },
});

export const updateAlbumMetadata = mutation({
  args: {
    year: v.string(),
    title: v.string(),
    subtitle: v.string(),
    description: v.string(),
    coverUrl: v.optional(v.string()),
    coverStorageKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("album_metadata")
      .withIndex("by_year", (q) => q.eq("year", args.year))
      .unique();

    if (existing) {
      const updateData: any = {
        title: args.title,
        subtitle: args.subtitle,
        description: args.description,
      };
      
      // Hanya update jika ada nilai baru, jika tidak, pertahankan yang lama
      if (args.coverUrl !== undefined) updateData.coverUrl = args.coverUrl;
      if (args.coverStorageKey !== undefined) updateData.coverStorageKey = args.coverStorageKey;

      await ctx.db.patch(existing._id, updateData);
      return existing._id;
    } else {
      return await ctx.db.insert("album_metadata", args);
    }
  },
});
