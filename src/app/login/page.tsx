'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Lock, Mail, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Simple client-side persistence for this "very basic" demo
                localStorage.setItem('mpn_user', JSON.stringify(data));

                if (data.role === 'Administrator') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo area */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-amber-600 mb-4 shadow-lg shadow-gold/20">
                        <Music className="w-8 h-8 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-white to-amber-500 bg-clip-text text-transparent">
                        MPN Conductor
                    </h1>
                    <p className="text-white/40 mt-2 text-sm">McKenney-Lacan Applied Theory Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-gold" />
                        Secure Access
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1 px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition outline-none"
                                    placeholder="name@aeon.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1 px-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-2 px-3 rounded-lg"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-gold to-amber-600 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-white/40 text-sm mb-4">Invitation Only Launch</p>
                        <Link
                            href="/#signup"
                            className="inline-flex items-center gap-2 text-gold hover:text-amber-400 transition text-sm font-medium"
                        >
                            <UserPlus className="w-4 h-4" />
                            Request Invitation Access
                        </Link>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-8 text-center text-xs text-white/20">
                    <p>Created by Jim McKenney</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <Link href="/wiki" className="hover:text-gold transition">Documentation</Link>
                        <span>•</span>
                        <Link href="/theory" className="hover:text-gold transition">Theory</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
