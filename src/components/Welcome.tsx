import { RatIcon } from "lucide-react";
import Link from "next/link";

export default function Welcome() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="flex justify-center mb-8">
        <RatIcon className="w-16 h-16 text-primary-600" />
      </div>
      <h1 className="text-4xl font-bold text-primary-800 mb-4">tiny health</h1>
      <p className="text-xl text-secondary-600 mb-8">
        Aplikacja do śledzenia zdrowia i historii medycznej twojego małego
        przyjaciela
      </p>
      <div className="space-x-4">
        <Link
          href="/sign-in"
          className="inline-block px-6 py-3 text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50"
        >
          Zaloguj się
        </Link>
        <Link
          href="/sign-up"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Zarejestruj się
        </Link>
      </div>
    </div>
  );
}
