import Link from "next/link";
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <main className="w-full max-w-96 mx-auto h-full flex flex-col items-center justify-center">
      <header className="text-2xl text-center font-bold mb-10">Welcome to <span className="text-blue-700">GymTrack</span></header>
      <section className="flex flex-col justify-center items-center">
        <p className="text-xl text-center">Track your workouts, monitor progress, and stay motivated every step of the way.</p>
        <Link href="/login" 
          className="flex items-center gap-5 text-amber-50 bg-blue-700 py-2 px-6 rounded-2xl mt-2 hover:bg-blue-900">
          <span>Log in</span>
          <ArrowRightIcon className="w-5"/>
        </Link>
      </section>
    </main>
  );
}
