import Link from "next/link";
import Image from "next/image";

/** ISD branding from https://www.isdakar.org/ — Navy #002d56, Gold #fdb913 */
export function ISDLogo({
  showSubtitle = true,
  href,
  className: extraClass,
}: {
  showSubtitle?: boolean;
  /** If set, logo links here (e.g. "/" for app home). If unset, links to isdakar.org */
  href?: string;
  className?: string;
}) {
  const content = (
    <>
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg"
        style={{ backgroundColor: "#002d56" }}
      >
        <Image
          src="/isd-logo.png"
          alt=""
          width={40}
          height={40}
          className="object-contain p-1.5"
        />
      </span>
      <span className="flex flex-col text-left">
        <span className="text-xl font-bold tracking-tight leading-tight" style={{ color: "#002d56" }}>
          International School of Dakar
        </span>
        {showSubtitle && (
          <span className="text-sm font-medium mt-0.5 opacity-85" style={{ color: "#002d56" }}>
            Device Loaner
          </span>
        )}
      </span>
    </>
  );

  const className = ["inline-flex items-center gap-3 rounded focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2", extraClass].filter(Boolean).join(" ");
  const style = { color: "#002d56" as const };

  if (href !== undefined) {
    return (
      <Link href={href} className={className} style={style}>
        {content}
      </Link>
    );
  }
  return (
    <a
      href="https://www.isdakar.org/"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {content}
    </a>
  );
}
