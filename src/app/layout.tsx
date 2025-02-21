import Navbar from "@/components/navbar";
import { env } from "@/lib/env";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Background from "@/components/background";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const font = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_WEBSITE_NAME,
  description: "Open Source ShareX Uploader.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.variable} antialiased h-screen w-screen relative flex flex-col grow`}
      >
        <Navbar />
        <Background />
        <Toaster />
        <div className="w-full h-full flex flex-col items-center">
          <main className="flex flex-col p-2 h-full max-w-7xl items-center">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
