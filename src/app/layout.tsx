import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Locale } from "@/i18n/config";
import { getUserLocale } from "@/i18n/locale";
import { enUS, plPL } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Roboto } from "next/font/google";

import "./globals.css";
import Providers from "./providers";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tiny health - rodents health tracking",
  description: "track your rodents' health and medical history",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const dynamic = "force-dynamic";

const clerkLocalizations = {
  pl: plPL,
  en: enUS,
} satisfies Record<Locale, unknown>;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getUserLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={roboto.className}>
        <ClerkProvider localization={clerkLocalizations[locale]}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </Providers>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
