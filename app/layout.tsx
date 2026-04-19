import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "Swad Anusar | Branded Digital Menu",
  description: "Experience the authentic taste of Swad Anusar with our digital menu and management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-sans bg-[#FFF8F0]`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
