import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Disclaimer from "@/components/common/Disclaimer";
import Analytics from "@/components/analytics/Analytics";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPOHut - Your Home for IPO Tracking & Analysis",
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
        <Analytics />
        <AnalyticsProvider>
          <Header />
          {children}
          <Disclaimer />
          <Footer />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
