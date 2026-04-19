import type { ReactNode } from "react";

type TitleProps = {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export default function Title({
  children,
  className = "",
  as: Tag = "h2",
}: TitleProps) {
  return <Tag className={`title ${className}`.trim()}>{children}</Tag>;
}
