import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nerd Extension",
  description: "Go to solution for any coding problem in one click",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Script
          src="http://localhost:3005/chatbot-sdk.umd.js"
          strategy="beforeInteractive"
        />

        <link rel="stylesheet" href="http://localhost:3005/chatbot-sdk.css" />
        {children} 
        {/* //every page, will be rendered inside this layout, so the SDK will be available on every page, and we can render our component in any page using the SDK */}
      </body>
    </html>
  );
}
