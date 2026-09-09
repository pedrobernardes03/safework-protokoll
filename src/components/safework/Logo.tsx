import { Link } from "@tanstack/react-router";

interface LogoProps {
  showText?: boolean;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  to?: string;
}

export function Logo({
  showText = true,
  className = "flex items-center gap-3",
  imageClassName = "h-12 w-12 object-contain",
  textClassName = "text-2xl font-extrabold tracking-tight",
  to,
}: LogoProps) {
  const content = (
    <div className={className}>
      <img
        src="/logo.png"
        alt="SafeWork Logo"
        className={imageClassName}
      />
      {showText && <span className={textClassName}>SafeWork</span>}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}
