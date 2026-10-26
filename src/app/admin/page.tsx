import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { AdminLoginClient } from "@/components/admin/AdminLoginClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = verifySessionToken(token);

  if (!isAuthenticated) {
    return <AdminLoginClient />;
  }

  return <AdminDashboardClient />;
}
