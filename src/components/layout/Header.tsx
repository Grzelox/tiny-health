import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("Header");

  return (
    <header className="glass-effect border-b border-border/70 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1 sm:gap-2 group">
          <div className="relative">
            <Image
              src="/favicon.ico"
              alt="tiny health logo"
              width={80}
              height={80}
              className="w-8 h-8 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-lg sm:text-xl font-bold text-gradient hover:from-primary-400 hover:to-primary-600 transition-all duration-300">
            tiny health
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          <SignedIn>
            <div className="p-1 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-modern",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2 sm:gap-2">
              <SignInButton mode="modal">
                <button className="btn-secondary px-4 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-sm font-medium rounded-lg min-h-[44px] sm:min-h-[40px]">
                  <span className="hidden sm:inline">{t("signIn")}</span>
                  <span className="sm:hidden">{t("signIn")}</span>
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary px-4 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-sm font-medium rounded-lg min-h-[44px] sm:min-h-[40px]">
                  <span className="hidden sm:inline">{t("signUp")}</span>
                  <span className="sm:hidden">{t("signUp")}</span>
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
