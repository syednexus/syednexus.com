import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 font-mono text-green-400">
      <p className="text-xs uppercase tracking-widest text-red-500">404 — route not found</p>
      <h1 className="mt-4 text-4xl font-bold text-red-300 sm:text-5xl">SIGNAL LOST</h1>
      <p className="mt-4 max-w-md text-center text-sm text-gray-500">
        The requested path does not exist in Nexus OS. Return to a known environment below.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/" className="border border-green-700 px-4 py-2 hover:bg-green-950">
          Gateway
        </Link>
        <Link href="/nexus" className="border border-green-700 px-4 py-2 hover:bg-green-950">
          Nexus OS
        </Link>
        <Link href="/soc" className="border border-green-700 px-4 py-2 hover:bg-green-950">
          SOC
        </Link>
        <Link href="/attack" className="border border-green-700 px-4 py-2 hover:bg-green-950">
          Attack Lab
        </Link>
        <Link href="/games" className="border border-green-700 px-4 py-2 hover:bg-green-950">
          Games
        </Link>
      </div>
    </main>
  );
}
