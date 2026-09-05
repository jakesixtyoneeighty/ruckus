"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RuckusMark } from "@/components/studio/ruckus-mark";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<"github" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // If already authenticated, redirect to home
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        window.location.href = "/";
      }
    });
  }, [supabase]);

  const handleOAuth = async (provider: "github" | "google") => {
    setLoadingProvider(provider);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}.`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0b0d] p-4">
      {/* Ambient spray-mist glow */}
      <div className="aurora-glow top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-white/15 bg-[#101214]/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.8),0_0_32px_rgba(0,213,255,0.08)]">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Ruckus</span>
        </Link>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <RuckusMark size={48} className="mb-3" />
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-[#f5f1e8]">
            Welcome to the garage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to save projects, keys, and deployments
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={!!loadingProvider}
            onClick={() => handleOAuth("google")}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 py-2.5 px-4 text-xs font-semibold text-white transition hover:border-[#00d5ff]/40 hover:bg-white/10 disabled:opacity-50"
          >
            {loadingProvider === "google" ? (
              <span className="text-slate-400">Connecting to Google...</span>
            ) : (
              <>
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={!!loadingProvider}
            onClick={() => handleOAuth("github")}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 py-2.5 px-4 text-xs font-semibold text-white transition hover:border-[#00d5ff]/40 hover:bg-white/10 disabled:opacity-50"
          >
            {loadingProvider === "github" ? (
              <span className="text-slate-400">Connecting to GitHub...</span>
            ) : (
              <>
                <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>Continue with GitHub</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center text-[11px] text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
