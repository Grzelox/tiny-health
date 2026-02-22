"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-background text-secondary-800">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-xl text-center space-y-6">
            <h1 className="text-3xl font-bold">Wystąpił błąd</h1>
            <p className="text-lg">Przepraszamy, coś poszło nie tak. Spróbuj ponownie.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => reset()}
                className="btn-primary px-6 py-3 text-base font-semibold rounded-xl"
              >
                Spróbuj ponownie
              </button>
              <a
                href="/"
                className="btn-secondary px-6 py-3 text-base font-semibold rounded-xl"
              >
                Wroć na strone glowna
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
