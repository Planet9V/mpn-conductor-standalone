'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Music,
  ArrowRight,
  Shield,
  Cpu,
  Activity,
  Users,
  Globe,
  ChevronDown,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold selection:text-black">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'
        }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
              <Music className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">
                MPN <span className="text-white/40 not-italic font-medium">Conductor</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/40">
              <a href="#theory" className="hover:text-gold transition">Theory</a>
              <a href="#features" className="hover:text-gold transition">Architecture</a>
              <Link href="/wiki" className="hover:text-gold transition">Wiki</Link>
            </nav>
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 text-xs font-bold uppercase tracking-widest transition-all hover:bg-gold hover:text-black"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest mb-8">
            <Sparkles className="w-3 h-3" />
            Invitation Only Access
          </div>

          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            THE MUSICAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-amber-500">
              PSYCHOMETRIC
            </span> <br />
            NOTATION
          </h2>

          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
            Bridging Lacanian psychoanalysis and symphonic calculus.
            A sovereign architecture for translating human trauma and entropy into pure orchestral signal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 rounded-full bg-gold text-black font-black uppercase tracking-widest hover:scale-105 transition shadow-2xl shadow-gold/20">
              Request Invitation
            </button>
            <Link href="/theory" className="w-full sm:w-auto px-10 py-4 rounded-full border border-white/10 hover:bg-white/5 transition text-xs font-bold uppercase tracking-widest">
              Explore Theory
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/20" />
        </div>
      </section>

      {/* Theory Highlight Section */}
      <section id="theory" className="py-32 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              style={{ y: y1 }}
              className="space-y-8"
            >
              <div className="w-12 h-1 w-20 bg-gold rounded-full" />
              <h3 className="text-4xl md:text-6xl font-bold leading-tight">
                The McKenney-Lacan <br />
                <span className="text-white/40">Symphonic Calculus</span>
              </h3>
              <div className="space-y-6 text-white/60 text-lg leading-relaxed">
                <p>
                  Developed by <span className="text-white font-bold">Jim McKenney</span>, the MPN framework leverages the Real, Symbolic, and Imaginary (RSI) registers to map the human psyche directly onto the musical stave.
                </p>
                <p>
                  By treating emotion failing as signal entropy (H) and trauma as a persistent Hamiltonian (Ĥ), we generate music that doesn't just represent state—it replicates the internal physics of the observer.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <TheoryPill label="Hamiltonian Logic" />
                <TheoryPill label="RSI Mapping" />
                <TheoryPill label="Ising Models" />
                <TheoryPill label="Entropy Gradients" />
              </div>
            </motion.div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-8 flex flex-col justify-center gap-12 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <TheoryMetric icon={<Cpu />} label="Signal Complexity" value="57 Dimensions" />
                <TheoryMetric icon={<Activity />} label="Training Scale" value="50k+ Pairs" />
                <TheoryMetric icon={<Globe />} label="Real-Time Latency" value="< 2.0s" />

                {/* Decorative Element */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[100%] border border-gold/10 rounded-full rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities / Endless Scroll feel */}
      <section id="features" className="py-32 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
            <Shield className="w-8 h-8 text-gold" />
            Sovereign Architecture
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Genius Composer"
              desc="Layered orchestration engine with trauma-informed instrumentation selector."
              icon={<Sparkles />}
            />
            <FeatureCard
              title="Psychoscore"
              desc="Custom transformer trained on 50k+ psychometric-to-music behavioral pairs."
              icon={<Cpu />}
            />
            <FeatureCard
              title="Shared Masters"
              desc="Immutable master library with per-project isolation and parameter overrides."
              icon={<Users />}
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 bg-gradient-to-b from-black to-gold/10 text-center px-6">
        <h2 className="text-4xl md:text-7xl font-black mb-10">THE FUTURE HAS <br /> <span className="text-gold italic">A SCORE.</span></h2>
        <Link
          href="/login"
          className="inline-flex items-center gap-4 px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest hover:bg-gold transition shadow-2xl shadow-gold/40"
        >
          Access Portal
          <ChevronRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] bg-black">
        <p>© 2026 MPN CONDUCTOR • AEON SOVEREIGN TECHNOLOGY • JIM MCKENNEY THEORY</p>
      </footer>
    </div>
  );
}

function TheoryPill({ label }: any) {
  return (
    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
      {label}
    </span>
  );
}

function TheoryMetric({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:scale-110 group-hover:bg-gold/10 transition">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: any) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-black transition">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3 group-hover:text-gold transition">{title}</h4>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
