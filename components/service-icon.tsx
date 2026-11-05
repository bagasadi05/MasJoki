import { BookOpen, FileCheck, GraduationCap, Languages, Palette, Presentation, RefreshCw, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ServiceId } from "@/lib/services";

export const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  parafrase: RefreshCw,
  humanisasi: Sparkles,
  makalah: BookOpen,
  jurnal: GraduationCap,
  powerpoint: Presentation,
  word: FileCheck,
  terjemah: Languages,
  desain: Palette,
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
