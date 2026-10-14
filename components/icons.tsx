type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const BagIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);
export const SearchIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);
export const MenuIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const CloseIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
export const WhatsAppIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.07.89.9-2.99-.2-.31a8.2 8.2 0 1 1 6.85 3.74Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.09-.39-.13-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.42l-.75-1.82c-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.17 3.68c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);
export const MinusIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M6 12h12" /></svg>
);
export const PlusIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M6 12h12M12 6v12" /></svg>
);
