import { BRAND } from "@/lib/brand";

export function BrandLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src={BRAND.assets.mark} alt="" aria-hidden="true" className="h-8 w-8 shrink-0" />
      {!compact && <span className="font-semibold tracking-[0.12em] text-sm">{BRAND.name}</span>}
    </span>
  );
}
