"use client";

import { createClient } from "@/utils/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => (
  <div className="flex items-center justify-center w-full">
    <div className="w-full max-w-md mt-20">{children}</div>
  </div>
);

export default function LoginPage() {
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

  if (!session) {
    return (
      <AuthContainer>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          onlyThirdPartyProviders={true}
          redirectTo={
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }
        />
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Welcome, {session.user.email}</h2>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
        >
          Wyloguj sie
        </button>
      </div>
    </AuthContainer>
  );
}
