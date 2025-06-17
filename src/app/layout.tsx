import type { Metadata } from "next";
import { Geist } from "next/font/google";
// import "./globals.css"; 
import { ClerkProvider } from "@clerk/nextjs";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
