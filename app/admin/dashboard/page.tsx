import { auth } from '@/app/lib/auth';

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session?.user?.email}</p>
    </div>
  );
};

