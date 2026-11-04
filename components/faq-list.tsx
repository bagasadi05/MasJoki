import { faq } from "@/content/faq";

export function FaqList() {
  return (
    <div className="space-y-3">
      {faq.map((item) => (
        <details
          key={item.q}
          className="group rounded-2xl border border-line bg-white p-5 transition-all duration-150 hover:border-brand/40 hover:shadow-sm [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
            <span className="font-display text-[1.02rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand">
              {item.q}
            </span>
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-paper-2 text-ink-soft transition-transform duration-200 group-open:rotate-45 group-open:bg-brand-soft group-open:text-brand">
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M8 2v12M2 8h12" />
              </svg>
            </span>
          </summary>
          <p className="mt-3.5 max-w-[68ch] text-[0.88rem] leading-relaxed text-ink-soft border-t border-dashed border-line pt-3">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
