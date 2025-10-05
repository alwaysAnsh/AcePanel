"use client"

import Link from "next/link";

import { CodeIcon } from "lucide-react";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import DasboardBtn from "./DashboardBtn";
import { ModeToggle } from "./ModeToggle";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";


function Navbar() {
  const { user } = useUser();
  // const {isLoaded} = useUser();
  const dbUser = useQuery(api.users.getUserByClerkId, {
      clerkId: user?.id || "",
    });

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* LEFT SIDE -LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <CodeIcon className="size-8 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            ApexInterview
          </span>
        </Link>

        {/* RIGHT SIDE - ACTIONS */}
        <SignedIn>
          <div className="flex items-center space-x-4 ml-auto">
            {dbUser?.role ?<DasboardBtn /> : <div></div>}
            <ModeToggle />
            {dbUser?.role ? <UserButton /> : <div></div>}
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
export default Navbar;