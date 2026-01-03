'use client';

import Link from 'next/link';
import { Music, BookOpen, FlaskConical, Play, FileText, Volume2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center">
              <Music className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-[#FFD700]">MPN</span>
                <span className="text-white/60 ml-2">Conductor</span>
              </h1>
              <p className="text-xs text-white/40">Musical Psychometric Notation</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/play-library" className="text-sm font-medium text-amber-500 hover:text-amber-400 transition animate-pulse">
              Library (New)
            </Link>
            <Link href="/mpn-conductor" className="text-sm text-white/60 hover:text-white transition">
              Conductor
            </Link>
            <Link href="/mpn-reference" className="text-sm text-white/60 hover:text-white transition">
              Reference
            </Link>
            <Link href="/mpn-lab" className="text-sm text-white/60 hover:text-white transition">
              Lab
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-[#FFD700]">Transform</span> Psychological States
            <br />
            Into <span className="text-[#FFD700]">Musical Scores</span>
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            The McKenney-Lacan Symphonic Calculus translates human psychometric profiles
            into real-time orchestral notation, revealing patterns invisible to traditional analysis.
          </p>

          {/* Application Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link
              href="/play-library"
              className="group p-6 rounded-xl border border-amber-500/30 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-amber-500/30 transition">
                <FileText className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-amber-500">Play Library</h3>
              <p className="text-sm text-white/50">
                Import raw scripts, manage your collection, and apply psychometric processing.
              </p>
            </Link>

            <Link
              href="/mpn-conductor"
              className="group p-6 rounded-xl border border-white/10 hover:border-[#FFD700]/50 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-[#FFD700]/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-[#FFD700]/30 transition">
                <Play className="w-6 h-6 text-[#FFD700]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Conductor</h3>
              <p className="text-sm text-white/50">
                Real-time orchestral score generation with multi-stave visualization and audio synthesis.
              </p>
            </Link>

            <Link
              href="/mpn-reference"
              className="group p-6 rounded-xl border border-white/10 hover:border-[#FFD700]/50 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-[#FFD700]/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-[#FFD700]/30 transition">
                <BookOpen className="w-6 h-6 text-[#FFD700]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reference</h3>
              <p className="text-sm text-white/50">
                Interactive dictionary of 55+ musical-psychometric mappings with parameter tuning.
              </p>
            </Link>

            <Link
              href="/mpn-lab"
              className="group p-6 rounded-xl border border-white/10 hover:border-[#FFD700]/50 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-[#FFD700]/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-[#FFD700]/30 transition">
                <FlaskConical className="w-6 h-6 text-[#FFD700]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Laboratory</h3>
              <p className="text-sm text-white/50">
                Experimental scenario driver with dialectic graph visualization and phase space analysis.
              </p>
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#FFD700]" />
              <span>Tone.js Audio</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FFD700]" />
              <span>Neo-Riemannian Harmony</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#FFD700]" />
              <span>DISC/OCEAN Mapping</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/30">
          <span>McKenney-Lacan Applied Theory v3.0</span>
          <span>© 2026 MPN Conductor</span>
        </div>
      </footer>
    </div>
  );
}
