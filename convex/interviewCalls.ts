import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logCall = mutation({
  args: {
    userId: v.string(),
    callId: v.string(),
    status: v.string(),
    startedAt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("interviewCalls", args);
  },
});

export const endCall = mutation({
  args: {
    callId: v.string(),
    endedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const call = await ctx.db
      .query("interviewCalls")
      .filter((q) => q.eq(q.field("callId"), args.callId))
      .first();
    if (call) {
      await ctx.db.patch(call._id, {
        status: "ended",
        endedAt: args.endedAt,
      });
    }
  },
});
