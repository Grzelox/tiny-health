import Image from "next/image";
import Link from "next/link";

import AuthSection from "../Auth/AuthSection";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/tiny-health-logo.png"
              alt="tiny health"
              width={80}
              height={80}
            />
          </Link>
          <AuthSection />
        </div>
      </div>
    </header>
  );
}
