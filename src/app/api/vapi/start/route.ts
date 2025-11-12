import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("https://api.vapi.ai/v1/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId: "edcd9ea3-9ba8-496b-8537-532c554762e8", // your assistant
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Vapi start error:", err);
      return NextResponse.json({ error: "Failed to start call" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error starting Vapi call:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
