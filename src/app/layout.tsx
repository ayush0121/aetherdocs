import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AetherDocs | Next-Gen PDF Tools",
  description: "Secure, client-side PDF manipulation tools. Merge, split, sign, and edit documents with privacy-first standards.",
  keywords: ["pdf", "merge", "split", "convert", "client-side", "secure", "AetherDocs"],
  authors: [{ name: "AetherDocs Team" }],
  openGraph: {
    title: "AetherDocs | The Future of Document Management",
    description: "Secure, fast, and free PDF tools running entirely in your browser.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
