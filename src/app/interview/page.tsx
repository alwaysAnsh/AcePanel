// "use client";
// import React, { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Vapi from "@vapi-ai/web";
// import { useMutation } from "convex/react";
// import { api } from "../../../convex/_generated/api";

// function InterviewPageContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const userId = searchParams.get("userId");

//   const [vapi, setVapi] = useState<any>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [callId, setCallId] = useState<string | null>(null);
//   const [transcript, setTranscript] = useState<string[]>([]);
//   const [isMuted, setIsMuted] = useState(false);

//   const logCall = useMutation(api.interviewCalls.logCall);
//   const endCall = useMutation(api.interviewCalls.endCall);

//   useEffect(() => {
//     if (!userId) {
//       router.push("/");
//       return;
//     }

//     const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
//     const v = new Vapi(apiKey);
//     setVapi(v);

//     // Call started
//     v.on("call-start", () => {
//       console.log("Call started");
//       setIsConnected(true);
//     });

//     // Call ended
//     v.on("call-end", () => {
//       console.log("Call ended");
//       setIsConnected(false);
//       if (callId) {
//         endCall({ callId, endedAt: new Date().toISOString() });
//       }
//       // Redirect back after interview ends
//       setTimeout(() => router.push("/"), 2000);
//     });

//     // Listen to messages/transcript (optional)
//     v.on("message", (message: any) => {
//       console.log("Message:", message);
//       if (message.type === "transcript" && message.transcript) {
//         setTranscript((prev) => [...prev, message.transcript]);
//       }
//     });

//     // Auto-start the interview when page loads
//     startCall(v);

//     return () => {
//       v.stop();
//     };
//   }, [userId, router]);

//   const startCall = async (vapiInstance: Vapi) => {
//     try {
//       const call = await vapiInstance.start("edcd9ea3-9ba8-496b-8537-532c554762e8");
//       console.log("Started call:", call);

//       if (call && call.id) {
//         setCallId(call.id);
//         await logCall({
//           userId: userId!,
//           callId: call.id,
//           status: "active",
//           startedAt: new Date().toISOString(),
//         });
//       }
//     } catch (error) {
//       console.error("Error starting interview:", error);
//       console.log("error starting interview -> ",error)
//       alert("Failed to start interview. Redirecting back...");
//       router.push("/");
//     }
//   };



//   const toggleMute = () => {
//     if (vapi) {
//       vapi.setMuted(!isMuted);
//       setIsMuted(!isMuted);
//     }
//   };

//   const endInterview = () => {
//     if (vapi) {
//       vapi.stop();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             AI Interview in Progress
//           </h1>
//           <p className="text-gray-600">
//             {isConnected ? "Connected - Speak clearly and confidently" : "Connecting..."}
//           </p>
//         </div>

//         {/* Status Indicator */}
//         <div className="flex justify-center mb-8">
//           <div
//             className={`w-20 h-20 rounded-full flex items-center justify-center ${
//               isConnected ? "bg-green-500 animate-pulse" : "bg-gray-300"
//             }`}
//           >
//             <span className="text-3xl">
//               {isConnected ? "🎙️" : "⏳"}
//             </span>
//           </div>
//         </div>

//         {/* Transcript Display (Optional) */}
//         {transcript.length > 0 && (
//           <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
//             <h3 className="font-semibold text-gray-700 mb-2">Transcript:</h3>
//             {transcript.map((line, idx) => (
//               <p key={idx} className="text-sm text-gray-600 mb-1">
//                 {line}
//               </p>
//             ))}
//           </div>
//         )}

//         {/* Controls */}
//         <div className="flex gap-4 justify-center">
//           <button
//             onClick={toggleMute}
//             disabled={!isConnected}
//             className={`px-6 py-3 rounded-full font-semibold shadow-md transition ${
//               isConnected
//                 ? isMuted
//                   ? "bg-yellow-500 hover:bg-yellow-600 text-white"
//                   : "bg-gray-600 hover:bg-gray-700 text-white"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             {isMuted ? "🔇 Unmute" : "🔊 Mute"}
//           </button>

//           <button
//             onClick={endInterview}
//             disabled={!isConnected}
//             className={`px-6 py-3 rounded-full font-semibold shadow-md transition ${
//               isConnected
//                 ? "bg-red-600 hover:bg-red-700 text-white"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             🔴 End Interview
//           </button>
//         </div>

//         {/* Tips */}
//         <div className="mt-8 p-4 bg-blue-50 rounded-lg">
//           <h3 className="font-semibold text-blue-900 mb-2">💡 Interview Tips:</h3>
//           <ul className="text-sm text-blue-800 space-y-1">
//             <li>• Speak clearly and take your time</li>
//             <li>• Use specific examples from your experience</li>
//             <li>• Ask for clarification if needed</li>
//             <li>• Be honest and authentic</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function InterviewPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-xl font-semibold text-gray-700">Loading interview...</div>
//       </div>
//     }>
//       <InterviewPageContent />
//     </Suspense>
//   );
// }



"use client";
import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

function InterviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");

  const [vapi, setVapi] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callId, setCallId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasStartedCall = useRef(false); // Prevent double-calling
  const callStartTimeout = useRef<NodeJS.Timeout | null>(null);

  const logCall = useMutation(api.interviewCalls.logCall);
  const endCall = useMutation(api.interviewCalls.endCall);

  useEffect(() => {
    if (!userId) {
      router.push("/");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
    
    if (!apiKey) {
      console.error("VAPI API key is missing");
      setError("Configuration error. Please contact support.");
      setIsConnecting(false);
      return;
    }

    const v = new Vapi(apiKey);
    setVapi(v);

    // Call started
    v.on("call-start", () => {
      console.log("Call started successfully");
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      
      // Clear timeout since call started successfully
      if (callStartTimeout.current) {
        clearTimeout(callStartTimeout.current);
        callStartTimeout.current = null;
      }
    });

    // Call ended
    v.on("call-end", () => {
      console.log("Call ended");
      setIsConnected(false);
      if (callId) {
        endCall({ callId, endedAt: new Date().toISOString() });
      }
      // Redirect back after interview ends
      setTimeout(() => router.push("/"), 2000);
    });

    // Error handling
    v.on("error", (error: any) => {
      console.error("Vapi error:", error);
      setError(error.message || "An error occurred during the call");
      setIsConnecting(false);
    });

    // Listen to messages/transcript (optional)
    v.on("message", (message: any) => {
      console.log("Message:", message);
      if (message.type === "transcript" && message.transcript) {
        setTranscript((prev) => [...prev, message.transcript]);
      }
    });

    

    // Wait a bit for Vapi to initialize before starting call
//     const initTimeout = setTimeout(() => {
//       if (!hasStartedCall.current) {
//         startCall(v);
//       }
//     }, 500);

//     return () => {
//       clearTimeout(initTimeout);
//       if (callStartTimeout.current) {
//         clearTimeout(callStartTimeout.current);
//       }
//       v.stop();
//     };
//   }, [userId, router]);

const initTimeout = setTimeout(async () => {
    if (!hasStartedCall.current) {
      // Fetch user name or get from URL params
      const userName = searchParams.get("userName") || "Candidate";
      startCall(v, userName);
    }
  }, 500);

  return () => {
    clearTimeout(initTimeout);
    if (callStartTimeout.current) {
      clearTimeout(callStartTimeout.current);
    }
    v.stop();
  };
}, [userId, router]);

  const startCall = async (vapiInstance: any, userName: string) => {
    if (hasStartedCall.current) {
      console.log("Call already started, skipping...");
      return;
    }

    hasStartedCall.current = true;
    setIsConnecting(true);

    // Set a timeout to handle cases where call-start event doesn't fire
    callStartTimeout.current = setTimeout(() => {
      if (!isConnected) {
        console.warn("Call start timeout - call may still be connecting");
        // Don't redirect immediately, give it more time
      }
    }, 10000); // 10 second timeout

    try {
      console.log("Starting Vapi call...");
      const call = await vapiInstance.start("edcd9ea3-9ba8-496b-8537-532c554762e8");
      console.log("Vapi start() completed:", call);

      if (call && call.id) {
        setCallId(call.id);
        
        // Log the call
        try {
          await logCall({
            userId: userId!,
            callId: call.id,
            status: "active",
            startedAt: new Date().toISOString(),
          });
        } catch (logError) {
          console.error("Error logging call:", logError);
          // Don't fail the interview if logging fails
        }
      }
    } catch (error: any) {
      console.error("Error in startCall:", error);
      
      // Check if it's a specific error we can handle
      if (error.message?.includes("already") || error.message?.includes("active")) {
        console.log("Call may already be active, continuing...");
        return;
      }

      setError(error.message || "Failed to start interview");
      setIsConnecting(false);
      hasStartedCall.current = false;

      // Only redirect after a delay and if truly failed
      setTimeout(() => {
        if (!isConnected) {
          router.push("/");
        }
      }, 3000);
    }
  };

  const toggleMute = () => {
    if (vapi) {
      vapi.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const endInterview = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  // Show error state
  if (error && !isConnected && !isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Connection Failed
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isConnecting ? "Connecting to AI Interviewer..." : "AI Interview in Progress"}
          </h1>
          <p className="text-gray-600">
            {isConnecting 
              ? "Please wait while we set up your interview" 
              : isConnected 
              ? "Connected - Speak clearly and confidently" 
              : "Connecting..."}
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex justify-center mb-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isConnected 
                ? "bg-green-500 animate-pulse" 
                : isConnecting
                ? "bg-yellow-500 animate-pulse"
                : "bg-gray-300"
            }`}
          >
            <span className="text-3xl">
              {isConnected ? "🎙️" : isConnecting ? "⏳" : "🔌"}
            </span>
          </div>
        </div>

        {/* Transcript Display (Optional) */}
        {transcript.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-2">Transcript:</h3>
            {transcript.map((line, idx) => (
              <p key={idx} className="text-sm text-gray-600 mb-1">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={toggleMute}
            disabled={!isConnected}
            className={`px-6 py-3 rounded-full font-semibold shadow-md transition ${
              isConnected
                ? isMuted
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>

          <button
            onClick={endInterview}
            disabled={!isConnected}
            className={`px-6 py-3 rounded-full font-semibold shadow-md transition ${
              isConnected
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            🔴 End Interview
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Interview Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Speak clearly and take your time</li>
            <li>• Use specific examples from your experience</li>
            <li>• Ask for clarification if needed</li>
            <li>• Be honest and authentic</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading interview...</div>
      </div>
    }>
      <InterviewPageContent />
    </Suspense>
  );
}






