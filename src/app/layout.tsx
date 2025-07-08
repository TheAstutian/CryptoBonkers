

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { UserContextProvider } from "./context/contextlibrary";
import { Providers } from "./context/contextprovider";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Crypto Bunkers",
  description: "Escape the crypto noise. Get tangible insights about everything blockchain. ",
}; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased px-1 md:px-5`}
      >
        
       <Providers>
       {children}
       </Providers>
        
      </body>
    </html>
  );
}
