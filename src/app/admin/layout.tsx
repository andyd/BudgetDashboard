import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AdminAuthForm } from '@/components/admin/admin-auth-form';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

async function checkAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_authenticated');
  return authCookie?.value === 'true';
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Admin Access</h1>
            <p className="mt-2 text-muted-foreground">
              Enter password to continue
            </p>
          </div>
          <AdminAuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
