import { faq } from "@/content/faq";

interface FaqListProps {
  limit?: number;
}

export function FaqList({ limit }: FaqListProps = {}) {
  const items = limit ? faq.slice(0, limit) : faq;

  return (
    <div className="space-y-3.5">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-3xl border border-line bg-white p-6 transition-all duration-200 hover:border-brand/40 hover:shadow-xs [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
            <span className="font-display text-[1.05rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand">
              {item.q}
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-paper-2 text-ink-soft transition-all duration-200 group-open:rotate-45 group-open:bg-brand group-open:text-white shadow-2xs">
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M8 2v12M2 8h12" />
              </svg>
            </span>
          </summary>
          <p className="mt-4 max-w-[68ch] text-[0.88rem] leading-relaxed text-ink-soft/90 border-t border-dashed border-line pt-3.5">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
