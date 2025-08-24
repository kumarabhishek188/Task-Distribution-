"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="block w-full">
      {label && <div className="mb-1.5 text-sm font-medium text-gray-700">{label}</div>}
      <input
        className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500 bg-white ${className}`}
        {...props}
      />
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </label>
  );
}
