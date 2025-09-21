// components/guards/RoleGate.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RoleGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const dbUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  useEffect(() => {
    debugger
    console.log("pathname: ", pathname)
    console.log("dbUser: ", dbUser)
    if (!isLoaded || !user || pathname === "/selectRole") return;

    if (dbUser === undefined) return; // Still loading from Convex
    if (dbUser && !dbUser.role) {
      router.replace("/selectRole");
    }
  }, [user, isLoaded, dbUser, pathname, router]);

  if (!isLoaded || !user || (dbUser && !dbUser.role && pathname !== "/selectRole")) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}