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
      </div>
  );
}
