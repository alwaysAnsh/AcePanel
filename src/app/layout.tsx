import type { Metadata } from "next";
import { Geist } from "next/font/google";
// import "./globals.css"; 
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClerkProvider from "@/components/providers/ConvexClerkProvider";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
    <html lang="en">
      <body className="" >
        {children}
      </body>
    </html>
    </ConvexClerkProvider>
  );
}
