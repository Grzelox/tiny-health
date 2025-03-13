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
            Śledź zdrowie
          </span>{" "}
          swoich małych przyjaciół
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto mb-8">
          Zadbaj o dobrostan swoich gryzoni. Zapisuj wszystkie wizyty u weterynarza i najważniejsze
          informacje w jednym miejscu. Stwórz galerię zdjęć swojego pupila i śledź ich rozwój.
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
              Wszystkie myszy w jednym miejscu
            </h3>
            <p className="text-lg text-secondary-600">
              Zapisuj najważniejsze informacje o swoich myszkach w jednym miejscu i zawsze miej je
              pod ręką.
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-32 text-center"
      >
        <p className="text-lg text-secondary-600 mb-6">
          Dołącz do nas i zadbaj o zdrowie swoich małych przyjaciół
        </p>
      </motion.div>
    </div>
  );
}
