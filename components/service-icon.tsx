import {
  BookOpen,
  FileCheck,
  FileText,
  GraduationCap,
  Languages,
  Palette,
  Presentation,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ServiceId } from "@/lib/services";

export const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  parafrase: RefreshCw,
  humanisasi: Sparkles,
  makalah: BookOpen,
  artikel_ilmiah: GraduationCap,
  jurnal_submit: FileText,
  jurnal: GraduationCap,
  powerpoint: Presentation,
  word: FileCheck,
  terjemah: Languages,
  paket_abstrak: Languages,
  desain: Palette,
  turnitin_ai: ShieldCheck,
};

interface ServiceIconProps {
  id: ServiceId;
  className?: string;
  size?: number;
}

export function ServiceIcon({ id, className = "size-5", size }: ServiceIconProps) {
  const IconComponent = SERVICE_ICONS[id] ?? BookOpen;
  return <IconComponent className={className} size={size} strokeWidth={2.2} />;
}
