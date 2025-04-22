import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPO Insights - Track the Market's Newest Additions",
  description: "Track performance metrics, analyze market trends, and discover investment opportunities in the IPO landscape.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
