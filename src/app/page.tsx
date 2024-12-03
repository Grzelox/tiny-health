import { auth } from '@clerk/nextjs';
import Welcome from '@/components/Welcome';
import Dashboard from '@/components/Dashboard';

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return <Welcome />;
  }

  return <Dashboard />;
}