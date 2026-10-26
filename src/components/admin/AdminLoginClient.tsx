"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";

export function AdminLoginClient() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Invalid username or password.");
        return;
      }

      // Reload to let Server Component evaluate valid session cookie
      window.location.reload();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1c080e] px-4 py-12 text-white selection:bg-gold selection:text-maroon-deep">
      <div className="w-full max-w-md">
        {/* Branding badge */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full border-2 border-gold/60 bg-maroon shadow-lg">
            <span className="font-serif text-sm font-bold tracking-[0.18em] text-gold-bright">
              BBG
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
            B.B. Gupta &amp; Bros.
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold-bright/80">
            Wholesale Counter · Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <ShieldCheck className="h-5 w-5 text-gold-bright" />
            <h2 className="font-serif text-lg font-semibold text-white">
              Staff Authentication
            </h2>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/80"
              >
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full rounded-xl border border-white/20 bg-black/30 py-3 pr-4 pl-10 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-gold-bright focus:ring-1 focus:ring-gold-bright"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/80"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-xl border border-white/20 bg-black/30 py-3 pr-11 pl-10 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-gold-bright focus:ring-1 focus:ring-gold-bright"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gold-bright font-semibold text-maroon-deep shadow-md transition hover:bg-gold active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-maroon-deep border-t-transparent" />
              ) : (
                "Sign In to Admin Portal"
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-gold-bright transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Storefront
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Secure, authenticated area for B.B. Gupta &amp; Bros. management only.
        </p>
      </div>
    </div>
  );
}
