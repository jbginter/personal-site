import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jonathan Ginter Fullstack Engineer Portfolio",
  description: "Portfolio showcasing 7+ years of fullstack engineering experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
