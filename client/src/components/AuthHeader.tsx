"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function hasToken() {
  if (typeof document === "undefined") return false;
  const inCookie = document.cookie.split(";").some((c) => c.trim().startsWith("token="));
  const inStorage = !!localStorage.getItem("token");
  return inCookie || inStorage;
}

export default function AuthHeader() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const update = async () => {
      try {
        const res = await fetch('/api/auth/status', { cache: 'no-store' });
        const data = await res.json();
        if (active) setAuthed(!!data.authed);
      } catch {
        if (active) setAuthed(hasToken());
      }
    };
    update();
    window.addEventListener('storage', update);
    window.addEventListener('visibilitychange', update);
    window.addEventListener('focus', update);
    return () => {
      active = false;
      window.removeEventListener('storage', update);
      window.removeEventListener('visibilitychange', update);
      window.removeEventListener('focus', update);
    };
  }, [pathname]);

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .finally(() => {
        try { localStorage.removeItem("token"); } catch {}
        window.location.href = "/login";
      });
  };

  return (
    <header className="w-full bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" className="font-bold text-lg text-blue-700">Admin-Agent</a>
        <nav className="flex items-center gap-3">
          {authed === null ? null : authed ? (
            <>
              <a href="/dashboard" className={`hover:text-blue-700 ${pathname?.startsWith("/dashboard") ? "text-blue-900 font-semibold" : "text-gray-700"}`}>Dashboard</a>
              <a href="/upload" className={`hover:text-blue-700 ${pathname?.startsWith("/upload") ? "text-blue-900 font-semibold" : "text-gray-700"}`}>Upload</a>
              <a href="/tasks" className={`hover:text-blue-700 ${pathname?.startsWith("/tasks") ? "text-blue-900 font-semibold" : "text-gray-700"}`}>Tasks</a>
              <button onClick={handleLogout} className="ml-2 px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700">Logout</button>
            </>
          ) : (
            <a href="/login" className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">Admin Login</a>
          )}
        </nav>
      </div>
    </header>
  );
}
