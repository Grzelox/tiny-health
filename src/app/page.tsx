import Dashboard from "@/components/Dashboard";
import Welcome from "@/components/Welcome";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return <Welcome />;
  }

  return <Dashboard />;
}
