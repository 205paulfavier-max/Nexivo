import clsx from "clsx";
import { initials } from "@/lib/format";

const PALETTE = [
  "bg-nexivo-blue",
  "bg-nexivo-red",
  "bg-nexivo-ink",
  "bg-nexivo-blue-dark",
  "bg-nexivo-red-dark",
];

function hashIndex(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % PALETTE.length;
}

export function Avatar({
  firstName,
  lastName,
  size = "md",
}: {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
}) {
  const color = PALETTE[hashIndex(firstName + lastName)];
  const sizeClass =
    size === "sm"
      ? "h-7 w-7 text-[11px]"
      : size === "lg"
      ? "h-12 w-12 text-base"
      : "h-9 w-9 text-sm";
  return (
    <div
      className={clsx(
        "flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white",
        color,
        sizeClass
      )}
    >
      {initials(firstName, lastName)}
    </div>
  );
}
