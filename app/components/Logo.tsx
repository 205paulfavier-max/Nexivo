import clsx from "clsx";

export function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const textColor = variant === "dark" ? "text-white" : "text-nexivo-black";
  return (
    <div className={clsx("flex flex-col leading-none", className)}>
      <span
        className={clsx(
          "text-2xl font-black italic tracking-tight",
          textColor
        )}
      >
        NEXIVO
      </span>
      <div className="mt-1 flex flex-col gap-[2px]">
        <span className="h-[3px] w-full skew-x-[-20deg] bg-nexivo-blue" />
        <span className="h-[3px] w-full skew-x-[-20deg] bg-nexivo-red" />
      </div>
    </div>
  );
}
