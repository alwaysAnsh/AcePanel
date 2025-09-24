import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// export const syncUser = mutation({
//     args: {
//         name: v.string(),
//         email: v.string(),
//         clerkId: v.string(),
//         image: v.optional(v.string()),
//     },

//     handler: async(ctx, args) => {

//         const existingUser = await ctx.db.query("users")
//         .filter(q => q.eq(q.field("clerkId"), args.clerkId)).first()

//         if(existingUser) return ;


//         return await ctx.db.insert("users", {
//             ...args,
//             role: "candidate",
//         })
//     }

// })


export const getUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const users = await ctx.db.query("users").collect();

    return users;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

//new fn

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
    role: v.optional(v.union(v.literal("candidate"), v.literal("interviewer"))),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

if (!existingUser) {
  // Insert user with or without role
  return await ctx.db.insert("users", {
    ...args
  });
}

    if (args.role && !existingUser.role || (existingUser.role !== "candidate" && existingUser.role !== 'interviewer')) {
      // Set role if missing
      return await ctx.db.patch(existingUser._id, {
        role: args.role,
      });
    }

    return;
  },
});