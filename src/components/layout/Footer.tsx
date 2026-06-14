import { Github, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative bg-footer-gradient text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-300/25 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary-400/20 rounded-full blur-2xl" />

      <div className="relative container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <Image
                src="/favicon.ico"
                alt="tiny health logo"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">tiny health</h3>
                <p className="text-primary-100/80 text-xs sm:text-sm font-medium">
                  {t("tagline")}
                </p>
              </div>
            </div>
          </div>

          {/* Links & Info Section */}
          <div className="flex flex-col items-center lg:items-end gap-4 lg:gap-6 w-full lg:w-auto">
            {/* Creator Info */}
            <div className="glass-effect bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 w-full max-w-sm lg:w-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-primary-100">
                  <Heart className="w-4 h-4 text-danger-300" />
                  <span className="text-xs sm:text-sm font-medium">{t("createdWithLove")}</span>
                </div>
                <Link
                  href="https://github.com/Grzelox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-primary-200 transition-all duration-300 group"
                >
                  <Github className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold text-xs sm:text-sm">Grzelo</span>
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-primary-100/60 text-xs sm:text-sm">
                {new Date().getFullYear()} tiny health
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-primary-100/60">
            <p className="text-center">{t("freeTool")}</p>
            <span className="hidden md:inline">•</span>
            <p className="text-center">{t("noAds")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
