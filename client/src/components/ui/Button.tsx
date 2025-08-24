"use client";
import React from "react";

type Variant = "primary" | "secondary" | "success" | "danger" | "warning" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  success: "bg-green-600 hover:bg-green-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-5 py-3 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-semibold shadow transition ${variants[variant]} ${sizes[size]} ${className} ${
        loading || disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
