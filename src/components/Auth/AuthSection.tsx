"use client";

import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthSection() {
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
      return;
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
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
  );
}
