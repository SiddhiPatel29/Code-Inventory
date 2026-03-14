"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Package2, Loader2, ArrowLeft, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sendOTP, verifyOTPAndResetPassword } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  
  // View States: login | forgot | verify
  const [view, setView] = useState<"login" | "forgot" | "verify">("login");
  
  // Login Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // OTP Reset Form
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Global View State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("email", email);

    const result = await sendOTP(formData);
    setIsLoading(false);

    if (result.success) {
      setSuccess("OTP has been sent to your email!");
      setView("verify");
    } else {
      setError(result.error || "Failed to send OTP.");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    formData.append("newPassword", newPassword);

    const result = await verifyOTPAndResetPassword(formData);
    setIsLoading(false);

    if (result.success) {
      setSuccess("Password reset successfully! You can now sign in.");
      setView("login");
      setPassword("");
      setOtp("");
      setNewPassword("");
    } else {
      setError(result.error || "Failed to reset password.");
    }
  };

  const switchView = (target: "login" | "forgot" | "verify") => {
    setView(target);
    setError("");
    setSuccess("");
  }

  // --- Renderers ---
  if (view === "forgot") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email to receive a secure recovery code. Look in your server console output!
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSendOTP}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-rose-500 bg-rose-500/10 rounded-md text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input 
                  id="reset-email" 
                  type="email" 
                  placeholder="admin@coreinventory.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Code
              </Button>
              <Button variant="ghost" type="button" className="w-full" onClick={() => switchView("login")} disabled={isLoading}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  if (view === "verify") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Verify Reset Code</CardTitle>
            <CardDescription>
              We&apos;ve sent a 6-digit OTP to your email {email ? `(${email})` : ''}. Note: Server Console.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerifyOTP}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-rose-500 bg-rose-500/10 rounded-md text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-sm text-emerald-600 bg-emerald-500/10 rounded-md text-center">
                  {success}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="otp">6-Digit Code</Label>
                <Input 
                  id="otp" 
                  type="text" 
                  placeholder="000000" 
                  required 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  className="tracking-widest text-center text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset & Update Password
              </Button>
              <Button variant="ghost" type="button" className="w-full" onClick={() => switchView("forgot")} disabled={isLoading}>
                Request a new code
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Package2 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Login to CoreInventory</CardTitle>
          <CardDescription>
            Enter your email and password to access the dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLoginSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-rose-500 bg-rose-500/10 rounded-md text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm text-emerald-600 bg-emerald-500/10 rounded-md text-center">
                {success}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@coreinventory.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline" onClick={(e) => { e.preventDefault(); switchView("forgot"); }}>
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
