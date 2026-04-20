import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter-next" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-next" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-poppins-next" });

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
      <body className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-sans bg-gray-100 flex justify-center min-h-screen`}>
        <div className="w-full max-w-md bg-[var(--background)] min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
          {children}
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
