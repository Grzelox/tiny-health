import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">tiny health</h3>
            <p className="text-sm mt-2">keeping your tiny friends healthy</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm">Created by</p>
              <Link
                href="https://github.com/Grzelox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm hover:text-primary-300 transition-colors"
              >
                Grzelo
              </Link>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} tiny health</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
