"use server";

import { cookies } from "next/headers";

import { Locale, defaultLocale, locales } from "./config";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (value && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  const store = await cookies();
  store.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
