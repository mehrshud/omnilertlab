"use client";

interface TechTagProps {
  label: string;
  color?: string;
  className?: string;
}

export default function TechTag({ label, color, className = "" }: TechTagProps) {
  return (
    <span
      className={`tech-badge ${className}`}
      style={color ? { borderColor: `${color}40`, color } : undefined}
    >
      {label}
    </span>
  );
}
