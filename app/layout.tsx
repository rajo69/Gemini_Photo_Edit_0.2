export const metadata = {
  title: "Gemini Image Chat",
  description: "Single-page Gemini 2.5 Flash Image app",
};
import "./globals.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
