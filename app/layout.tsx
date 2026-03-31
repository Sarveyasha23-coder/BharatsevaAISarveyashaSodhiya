import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BharatSeva AI",
  description:
    "Multilingual AI assistant for discovering government schemes, checking eligibility, and applying in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
