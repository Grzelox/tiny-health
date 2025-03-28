import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { plPL } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "./globals.css";
import Providers from "./providers";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tiny health - mouse health tracking",
  description: "track your mouse's health and medical history",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={plPL}>
      <html lang="pl">
        <body className={roboto.className}>
          <Providers>
            <div className="min-h-screen flex flex-col bg-primary-50">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
              <Footer />
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
