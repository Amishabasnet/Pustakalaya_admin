"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { admin, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && admin) router.replace("/dashboard");
  }, [isLoading, admin, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back.");
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Ambient decorative circles, echoing the book-cover illustration style from the app */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10" />
      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/[0.07]" />

      <div className="w-full max-w-[400px] relative">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_4px_12px_rgba(232,96,44,0.35)] mb-4">
            <BookOpen className="h-7 w-7 text-text-light" strokeWidth={2} />
          </div>
          <h1 className="font-display text-[30px] font-bold text-text-dark tracking-[0.3px]">
            Pustakalaya
          </h1>
          <p className="font-body text-[12.5px] font-medium text-text-medium tracking-[2px] uppercase mt-1">
            Admin Panel
          </p>
        </div>

        <div className="bg-surface rounded-card shadow-[0_4px_12px_rgba(26,20,14,0.07)] border border-border/70 p-7">
          <h2 className="font-body font-bold text-[17px] text-text-dark mb-1">Sign in</h2>
          <p className="text-[13px] text-text-medium mb-6">
            Enter your admin credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@pustakalaya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-text-medium hover:text-text-dark"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-danger-light text-danger text-[13px] font-medium rounded-btn px-3.5 py-2.5">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2" size="lg" isLoading={submitting}>
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-[12px] text-text-medium mt-6">
          Restricted to Pustakalaya staff. Contact an existing admin for access.
        </p>
      </div>
    </div>
  );
}
