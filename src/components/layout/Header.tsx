"use client";

import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { RatIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      setSession(initialSession);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    initializeAuth();
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
  };

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
          <div>
            {session ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
              >
                Wyloguj sie
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
              >
                Zaloguj sie z Google
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
