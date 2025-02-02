"use client";

import Dashboard from "@/components/Dashboard";
import Welcome from "@/components/Welcome";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-blue-500 text-lg">Loading...</span>
      </div>
    );
  }

  return user ? <Dashboard /> : <Welcome />;
}
