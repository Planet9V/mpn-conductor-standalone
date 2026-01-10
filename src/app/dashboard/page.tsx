'use client';

import { useState, useEffect } from 'react';
import {
    FileText,
    Plus,
    Library,
    Play,
    BookOpen,
    FlaskConical,
    Settings,
    MoreVertical,
    ChevronRight,
    Search,
    LogOut,
    User,
    Music,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function UserDashboard() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('mpn_user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            // In a real app, filter projects by current user ID
            const res = await fetch('/api/projects');
            if (res.ok) {
                const data = await res.json();
                setProjects(data.filter((p: any) => !p.is_template));
                setTemplates(data.filter((p: any) => p.is_template));
            }
        } catch (err) {
            console.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('mpn_user');
        window.location.href = '/login';
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-[#020202] text-white flex flex-col">
            {/* Top Navigation */}
            <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shadow-lg shadow-gold/10">
                            <Music className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">MPN Conductor</h1>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Workspace</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-2">
                            <Link href="/mpn-reference" className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition">References</Link>
                            <Link href="/mpn-lab" className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition">Lab</Link>
                            <Link href="/play-library" className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition">Library</Link>
                        </nav>

                        <div className="h-6 w-px bg-white/10" />

                        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative">
                            <div className="text-right">
                                <p className="text-sm font-semibold">{currentUser.name}</p>
                                <p className="text-[10px] text-gold uppercase font-bold tracking-tighter">{currentUser.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/40 to-amber-600/40 border border-gold/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-gold" />
                            </div>

                            {/* Profile Dropdown (Simplified) */}
                            <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
                                <div className="bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-2 w-48">
                                    <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 flex items-center gap-2 transition">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10 relative">
                {/* Welcome Section */}
                <div className="mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-2"
                    >
                        Welcome back, <span className="text-gold">{currentUser.name}</span>
                    </motion.h2>
                    <p className="text-white/40 max-w-2xl">
                        Continue your psychometric scoring research. Your projects are isolated and preserve master reference integrity.
                    </p>
                </div>

                {/* Project Grid */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Library className="w-5 h-5 text-gold" />
                            Your Projects
                        </h3>
                        <Link
                            href="/play-library/import"
                            className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gold transition"
                        >
                            <Plus className="w-4 h-4" /> New Project
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                        {projects.length === 0 && !loading && (
                            <div className="col-span-full py-16 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-white/20">
                                <FileText className="w-12 h-12 mb-4" />
                                <p>No personal projects yet. Start by cloning a master template.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Master Library */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-white/60">
                            <Shield className="w-5 h-5" />
                            Shared Master Library
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map(project => (
                            <ProjectCard key={project.id} project={project} isTemplate />
                        ))}
                    </div>
                </section>
            </main>

            {/* Quick Access Sidebar/Footer style */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-3">
                <ActionButton icon={<Play />} label="Conductor" href="/mpn-conductor" color="gold" />
                <ActionButton icon={<BookOpen />} label="Reference" href="/mpn-reference" color="white" />
                <ActionButton icon={<FlaskConical />} label="Lab" href="/mpn-lab" color="white" />
            </div>
        </div>
    );
}

function ProjectCard({ project, isTemplate }: any) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`group relative p-6 rounded-2xl border transition-all ${isTemplate
                ? 'bg-white/2 border-white/5 hover:border-white/20'
                : 'bg-gold/5 border-gold/20 hover:border-gold/50 shadow-lg shadow-gold/5'
                }`}
        >
            <div className="flex justify-between mb-4">
                <div className={`p-2 rounded-lg ${isTemplate ? 'bg-white/10' : 'bg-gold/20'}`}>
                    <FileText className={`w-5 h-5 ${isTemplate ? 'text-white/60' : 'text-gold'}`} />
                </div>
                <button className="text-white/20 hover:text-white transition">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <h4 className="text-lg font-bold mb-1 truncate group-hover:text-gold transition">{project.name}</h4>
            <p className="text-xs text-white/40 mb-6 line-clamp-2 h-8">{project.description || 'No description available.'}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                    {isTemplate ? 'Master Archive' : 'Personal Study'}
                </span>
                <Link
                    href={`/mpn-conductor?project=${project.id}`}
                    className="p-2 rounded-full border border-white/10 hover:bg-white text-white hover:text-black transition"
                >
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}

function ActionButton({ icon, label, href, color }: any) {
    return (
        <Link href={href} className="group relative flex items-center justify-end">
            <span className="absolute right-full mr-3 px-2 py-1 rounded bg-black border border-white/10 text-[10px] text-white font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition">
                {label}
            </span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition ${color === 'gold'
                ? 'bg-gold text-black hover:scale-110'
                : 'bg-zinc-900 border border-white/10 text-white hover:border-white/40'
                }`}>
                {icon}
            </div>
        </Link>
    );
}
