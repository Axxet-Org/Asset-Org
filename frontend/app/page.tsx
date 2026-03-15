export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-blue-700">AssetsOrg</h1>
      <p className="text-lg text-gray-600">
        Enterprise asset management — powered by Stellar
      </p>
      <div className="flex gap-4 mt-4">
        <a
          href="/dashboard"
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Dashboard
        </a>
        <a
          href="/login"
          className="rounded-lg border border-blue-600 px-6 py-2 text-blue-600 hover:bg-blue-50"
        >
          Sign In
        </a>
      </div>
    </main>
  );
}
