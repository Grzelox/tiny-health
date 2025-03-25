"use client";

import LoadingSpinner from "@/components/Animations/LoadingSpinner";
import Dashboard from "@/components/Dashboard";
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
