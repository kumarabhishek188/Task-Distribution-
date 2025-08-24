import React from "react";

type Tone = "info" | "success" | "warning" | "error";

const toneStyles: Record<Tone, string> = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  error: "bg-red-50 text-red-700 border-red-200",
};

export default function Alert({ tone = "info", children }: { tone?: Tone; children: React.ReactNode }) {
  return <div className={`px-4 py-3 rounded-lg border ${toneStyles[tone]}`}>{children}</div>;
}
