// import OpenAI from "openai";



// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const { question } = await req.json();

//     if (!question) {
//       return new Response(
//         JSON.stringify({ error: "Question is required" }),
//         { status: 400 }
//       );
//     }

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are IntervueX’s AI support assistant. Answer briefly and clearly about interview scheduling, recording, and platform-related help.",
//         },
//         { role: "user", content: question },
//       ],
//     });

//     const answer = response.choices[0]?.message?.content || "Sorry, I couldn’t process that.";

//     return new Response(JSON.stringify({ answer }), { status: 200 });
//   } catch (err) {
//     console.error("Chatbot error:", err);
//     return new Response(
//       JSON.stringify({ error: "Internal server error" }),
//       { status: 500 }
//     );
//   }
// }

// currently doing for predefined FAQs only

// src/app/api/chat/route.ts
import { NextResponse } from "next/server";

const FAQS = [
  { q: "schedule an interview", a: "Open the dashboard and click 'Schedule Interview'. Choose date/time and interviewers." },
  { q: "record the interview", a: "Interviews are recorded and retained for 15 days. Access them in the completed interviews section." },
  { q: "join a live interview", a: "When status is 'Live', click the 'Join Meeting' button on the interview card." },
  { q: "invite multiple interviewers", a: "Yes — add multiple interviewer IDs when scheduling; each will see the interview in their dashboard." },
  { q: "delete an interview", a: "Only the creator can delete the interview using the 'Delete' button on the interview card." },
  { q: "login or signup", a: "Use Clerk to sign up / sign in. You can sign in with providers like Google if enabled." },
  { q: "interview statuses", a: "Statuses are 'upcoming', 'live', or 'completed' determined by the scheduled start time." },
  { q: "recordings stored", a: "Recordings are stored for 15 days and then deleted automatically." },
  { q: "who can access recordings", a: "Only the interview creator and assigned interviewers can view recordings." },
  { q: "contact support", a: "You can reach support at intervuex.support@gmail.com or use this chat for help." },
];

// simple normalizer
function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// compute word-overlap score between two normalized strings
function overlapScore(a: string, b: string) {
  if (!a || !b) return 0;
  const aWords = Array.from(new Set(a.split(" ").filter(Boolean)));
  const bWords = Array.from(new Set(b.split(" ").filter(Boolean)));
  if (aWords.length === 0 || bWords.length === 0) return 0;

  let common = 0;
  for (const w of aWords) if (bWords.includes(w)) common++;
  // symmetric ratio
  const ratio = (common * 2) / (aWords.length + bWords.length);
  return ratio; // 0..1
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = typeof body.message === "string" ? body.message : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const normalizedMsg = normalize(message);

    // 1) exact substring match
    for (const faq of FAQS) {
      if (normalizedMsg.includes(normalize(faq.q))) {
        return NextResponse.json({ answer: faq.a });
      }
    }

    // 2) best overlap match
    let bestScore = 0;
    let bestFaq = null;
    for (const faq of FAQS) {
      const score = overlapScore(normalize(faq.q), normalizedMsg);
      if (score > bestScore) {
        bestScore = score;
        bestFaq = faq;
      }
    }

    // threshold: require at least some overlap
    if (bestFaq && bestScore >= 0.35) {
      return NextResponse.json({ answer: bestFaq.a, matched: bestFaq.q, score: bestScore });
    }

    // 3) fallback (optionally offer suggested topics)
    const suggestions = FAQS.map((f) => f.q).slice(0, 5);
    return NextResponse.json({
      answer:
        "I couldn't find a direct answer. Try asking about scheduling, joining, recording, or deleting interviews. Suggestions: " +
        suggestions.join(", "),
    });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


