import * as React from "react";
import clsx from "clsx";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("rounded-2xl border border-white/10 bg-white/[0.03] shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-5 border-b border-white/10", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-5", className)} {...props} />;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return (
    <button
      className={clsx(
        "rounded-2xl px-4 py-2 text-sm font-medium transition border",
        variant === "primary" &&
          "bg-white text-black border-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "ghost" &&
          "bg-transparent text-white border-white/15 hover:border-white/25 hover:bg-white/[0.04] disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-2xl bg-black border border-white/15 px-4 py-2 text-sm outline-none",
        "placeholder:text-white/40 focus:border-white/30",
        className
      )}
      {...props}
    />
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
      {children}
    </span>
  );
}
