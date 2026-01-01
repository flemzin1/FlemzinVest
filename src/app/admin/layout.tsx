
import { AdminAppShell } from "@/components/admin-app-shell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminAppShell>{children}</AdminAppShell>;
}
