import { auth } from '@/app/lib/auth';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function UserDashboardPage() {
  const session = await auth();

  return (
    <main className="w-full mt-8">
      <Link href="/user/dashboard/create-workout" className="flex flex-row items-center py-6 px-12 gap-2 h-10 rounded-2xl self-center mt-3 bg-blue-500 hover:bg-blue-900 cursor-pointer text-amber-50">
        <PlusIcon className="w-5" />
        <p>Log a Workout</p>
      </Link>
    </main>
  );
}
