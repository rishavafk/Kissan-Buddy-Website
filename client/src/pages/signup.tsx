'use client';

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { User, Lock, Mail, ArrowLeft, Loader2, Leaf } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAuth();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");
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
            backgroundImage: `url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2692&auto=format&fit=crop')`, // Drone over field
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent z-10" />

        {/* Content Overlay */}
        <div className="relative z-20 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-teal-500/20">
              <Leaf className="text-black w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Join the <span className="text-teal-400">Revolution</span>
            </h1>
            <p className="text-xl text-neutral-300 leading-relaxed">
              Empowering farmers with data-driven insights. Create your account to start optimizing your yield today.
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
            <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
            <p className="text-neutral-400 mt-2">Sign up for a new KissanBuddy account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    required
                    className="pl-10 h-12 bg-neutral-900/50 border-neutral-800 text-white focus:border-teal-500 focus:ring-teal-500/20 transition-all rounded-xl placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                  <Input
                    type="text"
                    placeholder="johndoe123"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    required
                    className="pl-10 h-12 bg-neutral-900/50 border-neutral-800 text-white focus:border-teal-500 focus:ring-teal-500/20 transition-all rounded-xl placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="pl-10 h-12 bg-neutral-900/50 border-neutral-800 text-white focus:border-teal-500 focus:ring-teal-500/20 transition-all rounded-xl placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    className="pl-10 h-12 bg-neutral-900/50 border-neutral-800 text-white focus:border-teal-500 focus:ring-teal-500/20 transition-all rounded-xl placeholder:text-neutral-600"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-teal-500 hover:bg-teal-400 text-black font-semibold rounded-xl text-md transition-all shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 mt-6"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm text-neutral-400 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => setLocation("/login")}
              className="text-teal-500 font-medium cursor-pointer hover:underline underline-offset-4"
            >
              Log in
            </span>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
