import { motion } from "framer-motion";
import { RatIcon } from "lucide-react";
import Image from "next/image";

export default function Welcome() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-24"
      >
        <div className="flex justify-center mb-6">
          <RatIcon className="w-20 h-20 text-primary-600" />
        </div>
        <h1 className="text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Dbaj o zdrowie
          </span>{" "}
          swoich małych bohaterów
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto mb-8">
          Dzięki naszemu narzędziu możesz łatwo rejestrować wizyty u weterynarza, monitorować zmiany
          w wadze i przechowywać wszystkie istotne informacje w jednym miejscu. Uwieczniaj wyjątkowe
          chwile, dodając zdjęcia swoich podopiecznych. Twoje myszy zasługują na najlepszą opiekę!
        </p>
      </motion.div>

      <div className="flex flex-col gap-32 max-w-[1400px] mx-auto px-4">
        {/* First Feature */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-8 md:gap-20"
        >
          <div className="w-full md:w-2/3 relative rounded-xl overflow-hidden shadow-xl">
            <div className="relative w-full pb-[74.89%]">
              <Image
                src="/example1.webp"
                alt="Historia medyczna - przykład"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 text-left">
            <h3 className="text-2xl font-semibold text-primary-800 mb-4">
              Prosty, intuicyjny interfejs
            </h3>
            <p className="text-lg text-secondary-600">
              Śledź historię zdrowotną swoich myszek – od wizyt u weterynarza, przez zmiany w wadze,
              aż po notatki. Wszystko, czego potrzebujesz, dostępne w jednym miejscu.
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
          <div className="w-full md:w-2/3 relative rounded-xl overflow-hidden shadow-xl">
            <div className="relative w-full pb-[80.35%]">
              <Image
                src="/example2.webp"
                alt="Monitorowanie wagi - przykład"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 text-left">
            <h3 className="text-2xl font-semibold text-primary-800 mb-4">Galeria pod ręką</h3>
            <p className="text-lg text-secondary-600">
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
          <div className="w-full md:w-2/3 relative rounded-xl overflow-hidden shadow-xl">
            <div className="relative w-full pb-[75%]">
              <Image
                src="/example3.webp"
                alt="Monitorowanie wagi - wykres"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 text-left">
            <h3 className="text-2xl font-semibold text-primary-800 mb-4">Prywatny i bezpieczny</h3>
            <p className="text-lg text-secondary-600">
              Nasz serwis jest całkowicie darmowy, wolny od reklam, a eksport danych daje Ci pełną
              kontrolę nad informacjami o Twoich zwierzakach.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-32 text-center"
      >
        <p className="text-lg text-secondary-600 mb-6">
          Dołącz do naszej społeczności i zadbaj o zdrowie swoich małych bohaterów już dziś!
        </p>
      </motion.div>
    </div>
  );
}
