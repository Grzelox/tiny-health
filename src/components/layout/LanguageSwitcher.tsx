"use client";

import { Locale, localeNames, locales } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { GlobeIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    startTransition(async () => {
      await setUserLocale(nextLocale);
      router.refresh();
    });
  };

  return (
    <div className="relative flex items-center">
      <GlobeIcon className="absolute left-2 w-4 h-4 text-secondary-500 pointer-events-none" />
      <select
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        aria-label={t("label")}
        className="appearance-none bg-white/80 border border-secondary-200 text-secondary-700 text-sm pl-7 pr-7 py-1.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-2 w-3 h-3 text-secondary-500 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
