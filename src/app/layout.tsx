import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthProvider from "@/components/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LokTantra — Indian Democracy Platform",
    template: "%s | LokTantra",
  },
  description:
    "The operating system for understanding Indian democracy. Explore governance, constitution, elections, and civic participation interactively.",
  keywords: [
    "Indian democracy",
    "Constitution of India",
    "governance",
    "elections",
    "Parliament",
    "UPSC",
    "civic education",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <MobileSidebar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
