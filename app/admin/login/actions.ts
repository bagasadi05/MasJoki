"use server";

import { redirect } from "next/navigation";
import { adminAktif, buatSesi, hapusSesi, passwordCocok } from "@/lib/auth";

export async function masuk(formData: FormData) {
  if (!adminAktif()) {
    redirect("/admin/login?galat=nonaktif");
  }

  const password = String(formData.get("password") ?? "");

  if (!passwordCocok(password)) {
    redirect("/admin/login?galat=salah");
  }

  await buatSesi();
  redirect("/admin");
}

export async function keluar() {
  await hapusSesi();
  redirect("/admin/login");
}
