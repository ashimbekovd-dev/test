import { SLOGAN } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <h1 className="text-4xl">{SLOGAN}</h1>
    </main>
  );
}
