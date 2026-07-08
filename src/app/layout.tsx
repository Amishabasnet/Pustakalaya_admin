import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import React from "react";

// Local fallback Providers wrapper to avoid missing-module errors.
// If you have a dedicated providers file, restore that import.
function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Pustakalaya Admin",
  description: "Admin dashboard for the Pustakalaya bookstore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-text-dark font-body">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-lato)",
                borderRadius: "12px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
