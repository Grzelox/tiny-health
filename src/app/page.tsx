"use client";

import Dashboard from "@/components/Dashboard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Welcome from "@/components/Welcome";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return user ? <Dashboard /> : <Welcome />;
}
