'use client';

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { User, Lock, ArrowLeft, Loader2, Sprout } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ username, password });
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-950 text-white overflow-hidden font-sans">

      {/* LEFT SIDE - VISUALS */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-60 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-bfkln9f.jpg')`, // Modern Drone Farming Image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent z-10" />

        {/* Content Overlay */}
        <div className="relative z-20 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
              <Sprout className="text-black w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Future of <span className="text-green-400">Farming</span>
            </h1>
            <p className="text-xl text-neutral-300 leading-relaxed">
              Monitor your crops, control drones, and analyze field data with the precision of AI. Welcome to KissanBuddy.
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-neutral-950">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="absolute top-8 left-8 text-neutral-400 hover:text-white gap-2 hover:bg-neutral-800"
        >
          <ArrowLeft size={16} /> Back
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
            <p className="text-neutral-400 mt-2">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-green-400 transition-colors" size={18} />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 h-12 bg-neutral-900/50 border-neutral-800 text-white focus:border-green-500 focus:ring-green-500/20 transition-all rounded-xl placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-green-400 transition-colors" size={18} />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-neutral-900/50 border-neutral-800 text-white focus:border-green-500 focus:ring-green-500/20 transition-all rounded-xl placeholder:text-neutral-600"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl text-md transition-all shadow-lg shadow-green-500/10 hover:shadow-green-500/20"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Sign In"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-neutral-950 px-2 text-neutral-500 uppercase tracking-wider">Or</span>
            </div>
          </div>

          <div className="text-center text-sm text-neutral-400">
            Don't have an account?{" "}
            <span
              onClick={() => setLocation("/signup")}
              className="text-green-500 font-medium cursor-pointer hover:underline underline-offset-4"
            >
              Create an account
            </span>
          </div>

          {/* Helper for testing */}
          <div className="mt-8 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800 text-xs text-neutral-500 text-left">
            <p className="font-semibold mb-1 text-neutral-400">Demo Credentials:</p>
            <p className="flex justify-between">
              <span>User: <span className="font-mono text-green-500">farmer1</span></span>
              <span>Pass: <span className="font-mono text-green-500">password123</span></span>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
