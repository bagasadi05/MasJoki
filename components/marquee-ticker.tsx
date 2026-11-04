export function MarqueeTicker() {
  const items = [
    { text: "HARGA PASTI DI AWAL", ikon: "🏷️" },
    { text: "GARANSI 2× REVISI GRATIS", ikon: "🔄" },
    { text: "PENGERJAAN MULAI 6 JAM", ikon: "⚡" },
    { text: "FILE ASLI WORD & PPT DISERAHKAN", ikon: "📁" },
    { text: "SHOPEEPAY · GOPAY · DANA", ikon: "💳" },
    { text: "PENYUNTINGAN NATURAL & RAPI", ikon: "✍️" },
    { text: "100% RAHASIA & PRIVAT", ikon: "🛡️" },
    { text: "LANGSUNG CHAT WHATSAPP TANPA AKUN", ikon: "💬" },
  ];

  return (
    <div className="relative overflow-hidden border-y border-line bg-paper-2/90 py-3 select-none">
      <div className="animate-marquee flex items-center gap-8">
        {[...items, ...items].map((item, index) => (
          <div
            key={`${item.text}-${index}`}
            className="flex items-center gap-2.5 font-display text-xs font-extrabold tracking-wider text-ink-soft whitespace-nowrap"
          >
            <span className="text-sm">{item.ikon}</span>
            <span>{item.text}</span>
            <span className="text-brand/40 text-xs ml-4">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
