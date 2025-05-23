import { motion } from "framer-motion";
import { RatIcon } from "lucide-react";
import Image from "next/image";

export default function Welcome() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-hero-gradient opacity-50" />
      <div className="absolute top-20 left-20 w-40 h-40 bg-primary-200/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-40 right-20 w-60 h-60 bg-secondary-200/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-24 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-gradient-to-br from-primary-100/80 to-primary-200/60 backdrop-blur-sm rounded-2xl shadow-modern-lg">
            <RatIcon className="w-20 h-20 text-primary-600" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-8 leading-tight">
          <span className="text-gradient bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800">
            Dbaj o zdrowie
          </span>{" "}
          <br />
          swoich małych bohaterów
        </h1>
        <p className="text-xl text-secondary-700 max-w-3xl mx-auto mb-8 leading-relaxed">
          Dzięki naszemu narzędziu możesz łatwo rejestrować wizyty u weterynarza, monitorować zmiany
          w wadze i przechowywać wszystkie istotne informacje w jednym miejscu. Uwieczniaj wyjątkowe
          chwile, dodając zdjęcia swoich podopiecznych. Twoje myszy zasługują na najlepszą opiekę!
        </p>
      </motion.div>

      <div className="flex flex-col gap-32 max-w-[1400px] mx-auto px-4 relative z-10">
        {/* First Feature */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-8 md:gap-20"
        >
          <div className="w-full md:w-2/3 relative rounded-2xl overflow-hidden shadow-modern-xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-full pb-[74.89%]">
              <Image
                src="/example1.webp"
                alt="Historia medyczna - przykład"
                fill
                priority
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 text-left">
            <h3 className="text-3xl font-semibold text-gradient mb-6">
              Prosty, intuicyjny interfejs
            </h3>
            <p className="text-lg text-secondary-700 leading-relaxed">
              Śledź historię zdrowotną swoich gryzoni – od wizyt u weterynarza, przez zmiany w
              wadze, aż po notatki. Wszystko, czego potrzebujesz, dostępne w jednym miejscu.
            </p>
          </div>
        </motion.div>

        {/* Second Feature */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-20"
        >
          <div className="w-full md:w-2/3 relative rounded-2xl overflow-hidden shadow-modern-xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-full pb-[80.35%]">
              <Image
                src="/example2.webp"
                alt="Monitorowanie wagi - przykład"
                fill
                priority
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 text-left">
            <h3 className="text-3xl font-semibold text-gradient mb-6">Galeria pod ręką</h3>
            <p className="text-lg text-secondary-700 leading-relaxed">
              Dodawaj najfajniejsze zdjęcia swojego pupila i wracaj do wspomnień.
            </p>
          </div>
        </motion.div>

        {/* Third Feature */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-8 md:gap-20"
        >
          <div className="w-full md:w-2/3 relative rounded-2xl overflow-hidden shadow-modern-xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-full pb-[75%]">
              <Image
                src="/example3.webp"
                alt="Monitorowanie wagi - wykres"
                fill
                priority
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 text-left">
            <h3 className="text-3xl font-semibold text-gradient mb-6">Prywatny i bezpieczny</h3>
            <p className="text-lg text-secondary-700 leading-relaxed">
              Nasz serwis jest całkowicie darmowy, wolny od reklam, a eksport danych daje Ci pełną
              kontrolę nad informacjami o Twoich gryzoniach.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-32 text-center relative z-10"
      >
        <div className="card-modern p-8 rounded-2xl max-w-2xl mx-auto">
          <p className="text-lg text-secondary-700 mb-6 leading-relaxed">
            Dołącz do naszej społeczności i zadbaj o zdrowie swoich małych bohaterów już dziś!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
