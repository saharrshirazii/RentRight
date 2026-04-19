import type { ReactNode } from "react";

type SubtitleProps = {
  children: ReactNode;
  className?: string;
};

export default function Subtitle({
  children,
  className = "",
}: SubtitleProps) {
  return <p className={`subtitle ${className}`.trim()}>{children}</p>;
}
