"use client";

import React, { useState, useMemo } from "react";
import { ArrowLeft, Mail, Lock, Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RuckusMark } from "@/components/studio/ruckus-mark";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/`,
          },
        });
        if (error) throw error;
        setIsSuccess(true);
        setMessage("Account created! Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setIsSuccess(true);
        setMessage("Signed in successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (err: any) {
      setIsSuccess(false);
      setMessage(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "github" | "google") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/`,
      },
    });
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
            {isSignUp ? "Join the crew" : "Back to the garage"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to save projects, keys, and deployments
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2 mb-6">
          <button
            onClick={() => handleOAuth("github")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 px-4 text-xs font-semibold text-white transition hover:border-[#00d5ff]/40 hover:bg-white/10"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-[#101214] px-3 text-[11px] uppercase tracking-wider text-slate-500">
            or with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#00d5ff]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#00d5ff]/50"
              />
            </div>
          </div>

          {message && (
            <div
              className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
                isSuccess
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/15 border border-rose-500/30 text-rose-300"
              }`}
            >
              {isSuccess && <Check className="h-4 w-4 shrink-0" />}
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cta-ruckus w-full rounded-lg bg-[#ff5a1f] py-2.5 text-xs font-bold text-[#0a0b0d] shadow-[0_4px_16px_rgba(255,90,31,0.4)] transition disabled:opacity-50 mt-2"
          >
            {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="font-semibold text-[#00d5ff] hover:text-white underline ml-1"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
