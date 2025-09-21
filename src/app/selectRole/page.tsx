"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";

export default function SelectRolePage() {
  const router = useRouter();
  const { user } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  const handleRoleSelect = async (role: "candidate" | "interviewer") => {
    await syncUser({
      name: user?.fullName || "Unnamed",
      email: user?.emailAddresses[0]?.emailAddress || "",
      clerkId: user?.id || "",
      image: user?.imageUrl,
      role,
    });
    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white">
          👋 Welcome to <span className="text-green-400">Intervuex</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Get started by choosing your role below.
        </p>

        <div className="flex justify-center gap-6">
          <Button
            onClick={() => handleRoleSelect("candidate")}
            className="bg-pink-600 hover:bg-pink-700 text-white text-md px-6 py-2 rounded-xl transition"
          >
            Candidate
          </Button>
          <Button
            onClick={() => handleRoleSelect("interviewer")}
            className="bg-green-600 hover:bg-green-700 text-white text-md px-6 py-2 rounded-xl transition"
          >
            Interviewer
          </Button>
        </div>
      </div>
    </main>
  );
}