import type { SocialName } from "@/content/site";

/** Pictogrammes des réseaux (lucide-react n'embarque plus les logos de marque). */
export function SocialIcon({
  name,
  className = "size-5",
}: {
  name: SocialName;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
  } as const;

  switch (name) {
    case "Instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.5V14h2.7v8h3.3z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...common} fill="currentColor">
          <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z" />
        </svg>
      );
  }
}
