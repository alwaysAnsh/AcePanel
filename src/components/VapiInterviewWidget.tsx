"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  userName: string;
}

const VapiInterviewWidget: React.FC<Props> = ({ userId, userName }) => {
  const router = useRouter();

  const startInterview = () => {
    // Redirect to interview page
    router.push(`/interview?userId=${userId}&userName=${encodeURIComponent(userName)}`);
  };

  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={startInterview}
        className="px-5 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
      >
        🎙️ Take AI Interview
      </button>
    </div>
  );
};

export default VapiInterviewWidget;