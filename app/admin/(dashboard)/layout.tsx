import { redirect } from "next/navigation";
import { sudahMasuk } from "@/lib/auth";

export const instant = false;

export default async function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await sudahMasuk())) redirect("/admin/login");

  return <div className="min-h-dvh bg-paper">{children}</div>;
}
