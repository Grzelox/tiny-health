import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="glass-effect border-b border-white/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Image
              src="/favicon.ico"
              alt="tiny health logo"
              width={80}
              height={80}
              className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-xl font-bold text-gradient hover:from-primary-700 hover:to-primary-900 transition-all duration-300">
            tiny health
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="p-1 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-white shadow-modern",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="btn-secondary px-4 py-2 text-sm font-medium rounded-lg">
                  Zaloguj się
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary px-4 py-2 text-sm font-medium rounded-lg">
                  Zarejestruj się
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
