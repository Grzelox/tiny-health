import { UserButton } from "@clerk/nextjs";
import { RatIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/tiny-health-logo.png" alt="tiny health" width={80} height={80} />
          </Link>

          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
