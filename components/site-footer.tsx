import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="text-xs text-white/60">
          © {new Date().getFullYear()} Mushee. Built on XDC (demo).
        </div>

        <div className="flex items-center gap-3 text-xs">
          <a
            className="no-underline text-white/70 hover:text-white inline-flex items-center gap-1"
            href="https://mushee.xyz"
            target="_blank"
            rel="noreferrer"
          >
            Website <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            className="no-underline text-white/70 hover:text-white inline-flex items-center gap-1"
            href="https://x.com/mushee_io"
            target="_blank"
            rel="noreferrer"
          >
            Twitter <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
