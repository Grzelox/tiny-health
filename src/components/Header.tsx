import { UserButton } from '@clerk/nextjs';
import { MouseIcon } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MouseIcon className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-semibold text-primary-800">TinyHealth</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;