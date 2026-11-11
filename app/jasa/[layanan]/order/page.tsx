import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SpecializedOrderForm } from "@/components/specialized-order-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOrderSpec } from "@/lib/order-specs";
import { getService, SERVICES, type ServiceId } from "@/lib/services";

const SLUG = new Set(SERVICES.map((s) => s.id));

interface OrderPageProps {
  params: Promise<{ layanan: string }>;
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ layanan: service.id }));
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { layanan } = await params;
  if (!SLUG.has(layanan as ServiceId)) return {};
  const service = getService(layanan as ServiceId);
  const spec = getOrderSpec(service.id);

  return {
    title: spec.headline,
    description: spec.subheadline,
    alternates: { canonical: `/jasa/${service.id}/order` },
  };
}

export default async function HalamanOrderSpesifik({ params }: OrderPageProps) {
  const { layanan } = await params;
  if (!SLUG.has(layanan as ServiceId)) notFound();

  const service = getService(layanan as ServiceId);
  const spec = getOrderSpec(service.id);

  return (
    <>
      <SiteHeader />

      <main id="konten" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Breadcrumb */}
        <nav
          aria-label="Remah roti"
          className="flex items-center gap-2 text-[0.8rem] font-medium text-muted"
        >
          <Link href="/" className="transition-colors hover:text-brand">
            Beranda
          </Link>
          <span aria-hidden className="text-muted/40">
            /
          </span>
          <Link href="/jasa" className="transition-colors hover:text-brand">
            Layanan
          </Link>
          <span aria-hidden className="text-muted/40">
            /
          </span>
          <Link
            href={`/jasa/${service.id}`}
            className="transition-colors hover:text-brand"
          >
            {service.name}
          </Link>
          <span aria-hidden className="text-muted/40">
            /
          </span>
          <span className="font-bold text-ink">Formulir Pemesanan</span>
        </nav>

        {/* Header Title */}
        <div className="mt-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <Link
              href={`/jasa/${service.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-brand transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Kembali ke Detail Layanan</span>
            </Link>
          </div>

          <h1 className="mt-3 font-display text-[2.2rem] leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.8rem]">
            {spec.headline}
          </h1>
          <p className="mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-slate-600">
            {spec.subheadline} Lengkapi 3 langkah cepat di bawah ini untuk mendapatkan estimasi terkunci dan mengirim naskah langsung ke Mas Joki.
          </p>
        </div>

        {/* Specialized Order Wizard Form */}
        <div className="mt-10">
          <SpecializedOrderForm service={service} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
