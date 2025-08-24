"use client";

import { useEffect, useState } from "react";

const buttons = [
  {
    href: "/login",
    label: "Admin Login",
    bg: "bg-blue-600",
    hover: "hover:bg-blue-700",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 00-3.8-4A4 4 0 008 2z"></path>
        <path d="M16 21a4 4 0 004-4h0a4 4 0 01-4-4h0a4 4 0 01-4 4h0a4 4 0 004 4z"></path>
        <path d="M20 21v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8"></path>
      </svg>
    ),
  },
  {
    href: "/dashboard",
    label: "Agent Management",
    bg: "bg-green-600",
    hover: "hover:bg-green-700",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-3.8-4A4 4 0 008 2z"></path>
        <path d="M17 21a4 4 0 014-4h0a4 4 0 01-4-4h0a4 4 0 01-4 4h0a4 4 0 014 4z"></path>
        <path d="M21 21v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8"></path>
      </svg>
    ),
  },
  {
    href: "/upload",
    label: "Upload Tasks (CSV/XLSX)",
    bg: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12h14"></path>
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "View Task Distribution",
    bg: "bg-purple-600",
    hover: "hover:bg-purple-700",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10h18M3 6h18M4 6v14M20 6v14"></path>
      </svg>
    ),
  },
];

export default function Home() {
  // Ripple animation handler
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/status', { cache: 'no-store' });
        const data = await res.json();
        if (mounted) setAuthed(!!data.authed);
      } catch {
        // Fallback: client-side cookie check
        if (mounted) setAuthed(typeof document !== 'undefined' && document.cookie.includes('token='));
      }
    })();
    return () => { mounted = false; };
  }, []);

  const addRipple = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.id !== id));
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-200 via-purple-300 to-yellow-200">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-xl flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-800 tracking-tight text-center drop-shadow-lg hover:underline cursor-default">
          Admin-Agent Task Distribution System
        </h1>
        <p className="mb-10 text-xl text-gray-600 text-center max-w-md font-medium leading-relaxed">
          Welcome! Use the links below to get started:
        </p>

        <div className="flex flex-col gap-6 w-full">
          {buttons
            .filter((b) => !(authed && b.href === '/login'))
            .map(({ href, label, bg, hover, icon }, index) => (
            <a
              key={href}
              href={href}
              onClick={(e) => addRipple(e, index)}
              className={`relative overflow-hidden flex items-center gap-3 justify-center py-4 px-6 rounded-xl text-white font-semibold shadow-lg transition transform active:scale-95 ${bg} ${hover}`}
              aria-label={label}
            >
              {icon}
              {label}
              {/* Ripple container */}
              <span className="absolute inset-0 pointer-events-none">
                {ripples
                  .filter((r) => r.id === index)
                  .map((ripple, i) => (
                    <span
                      key={i}
                      className="absolute bg-white bg-opacity-30 rounded-full animate-ripple"
                      style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: 100,
                        height: 100,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ))}
              </span>
            </a>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes ripple {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0.5;
            }
            100% {
              transform: translate(-50%, -50%) scale(3);
              opacity: 0;
            }
          }
          .animate-ripple {
            animation: ripple 0.5s linear;
          }
        `}
      </style>
    </div>
  );
}
