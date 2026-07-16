interface BrandMarkProps {
  size?: number;
}

/**
 * Abstraktes Zeichen: ein Puls, der in ein "+" (Gesundheit) übergeht —
 * bewusst reduziert, keine Stock-Icon-Ästhetik.
 */
export function BrandMark({ size = 32 }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="EinfachPatho Logo"
    >
      <rect width="40" height="40" rx="11" fill="#0e6e66" />
      <path
        d="M7 21.5H14.5L17 15L21.5 27L24.5 21.5H33"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
