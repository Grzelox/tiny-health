"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          {/* Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative p-6 bg-card-gradient backdrop-blur-sm rounded-3xl shadow-modern-xl border border-white/40"
              >
                <AlertTriangle className="w-16 h-16 text-primary-600" />
              </motion.div>
            </div>
          </div>

          {/* Error Code */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold text-gradient mb-4"
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary-700 mb-4">
              Strona nie została znaleziona
            </h2>
            <p className="text-lg text-secondary-600 leading-relaxed max-w-lg mx-auto">
              Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona. Sprawdź
              adres URL lub wróć do strony głównej.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center"
          >
            <Link href="/">
              <button className="btn-primary px-6 py-3 text-base font-semibold rounded-xl hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Strona główna
              </button>
            </Link>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-12 pt-8 border-t border-secondary-200/50"
          >
            <p className="text-sm text-secondary-500 mb-4">Może przydają Ci się te linki:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/sign-in"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200 hover:underline"
              >
                Logowanie
              </Link>
              <span className="text-secondary-300">•</span>
              <Link
                href="/sign-up"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200 hover:underline"
              >
                Rejestracja
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
