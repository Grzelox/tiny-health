import { UserButton } from "@clerk/nextjs";
import { RatIcon } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <RatIcon className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-semibold text-primary-800">
              tiny health
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
