'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Settings,
    MessageSquare,
    Shield,
    CheckCircle,
    XCircle,
    Save,
    Activity,
    Plus,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState<any[]>([]);
    const [config, setConfig] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            // In a real app, these would be separate API calls
            const [usersRes, configRes, logsRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/config'),
                fetch('/api/admin/logs')
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (configRes.ok) setConfig(await configRes.json());
            if (logsRes.ok) setLogs(await logsRes.json());
        } catch (err) {
            console.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string, status: boolean) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_approved: status })
            });
            if (res.ok) fetchAdminData();
        } catch (err) {
            console.error('Failed to update user status');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                        <Shield className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-bold tracking-tight text-white/90">Admin Core</span>
                </div>

                <nav className="space-y-1">
                    <TabButton
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                        icon={<Users className="w-4 h-4" />}
                        label="User Management"
                    />
                    <TabButton
                        active={activeTab === 'requests'}
                        onClick={() => setActiveTab('requests')}
                        icon={<MessageSquare className="w-4 h-4" />}
                        label="Access Requests"
                    />
                    <TabButton
                        active={activeTab === 'config'}
                        onClick={() => setActiveTab('config')}
                        icon={<Settings className="w-4 h-4" />}
                        label="System Config"
                    />
                    <TabButton
                        active={activeTab === 'logs'}
                        onClick={() => setActiveTab('logs')}
                        icon={<Activity className="w-4 h-4" />}
                        label="Audit Logs"
                    />
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10" />
                        <div>
                            <p className="text-sm font-medium">Jim (Admin)</p>
                            <p className="text-xs text-white/30 truncate">jim@aeon.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
                        <p className="text-white/40 text-sm">Manage system-wide parameters and access.</p>
                    </div>
                    <button
                        onClick={fetchAdminData}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </header>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <AnimatePresence mode="wait">
                        {activeTab === 'users' && (
                            <motion.div
                                key="users"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="p-6"
                            >
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 text-xs text-white/30 uppercase tracking-wider">
                                            <th className="pb-4 font-medium">User</th>
                                            <th className="pb-4 font-medium">Role</th>
                                            <th className="pb-4 font-medium">Status</th>
                                            <th className="pb-4 font-medium">Created At</th>
                                            <th className="pb-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(user => (
                                            <tr key={user.id} className="text-sm">
                                                <td className="py-4">
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-white/40 text-xs">{user.email}</div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.role === 'Administrator' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    {user.is_approved ? (
                                                        <span className="text-emerald-400 flex items-center gap-1.5">
                                                            <CheckCircle className="w-3.5 h-3.5" /> Approved
                                                        </span>
                                                    ) : (
                                                        <span className="text-amber-400 flex items-center gap-1.5">
                                                            <Activity className="w-3.5 h-3.5" /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-white/40">{new Date(user.created_at).toLocaleDateString()}</td>
                                                <td className="py-4 text-right">
                                                    <button
                                                        onClick={() => handleApprove(user.id, !user.is_approved)}
                                                        className={`p-1.5 rounded-lg transition ${user.is_approved ? 'hover:bg-red-500/10 hover:text-red-400' : 'hover:bg-emerald-500/10 hover:text-emerald-400'
                                                            }`}
                                                    >
                                                        {user.is_approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {activeTab === 'config' && (
                            <motion.div
                                key="config"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="p-6"
                            >
                                <div className="grid gap-6">
                                    {config.map(item => (
                                        <div key={item.id} className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">{item.key}</label>
                                                <span className="text-[10px] text-white/20 italic">{item.description}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    defaultValue={item.value}
                                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold outline-none"
                                                />
                                                <button className="bg-gold text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90">
                                                    <Save className="w-3.5 h-3.5" /> Update
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="border border-white/10 border-dashed rounded-2xl py-8 text-white/30 hover:text-white/60 hover:bg-white/5 transition flex flex-col items-center gap-2">
                                        <Plus className="w-6 h-6" />
                                        <span className="text-sm font-medium">Add New Configuration Property</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'logs' && (
                            <motion.div
                                key="logs"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="p-6"
                            >
                                <div className="space-y-4">
                                    {logs.map(log => (
                                        <div key={log.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 text-sm">
                                            <div className="text-white/30 text-xs w-32 shrink-0">{new Date(log.created_at).toLocaleString()}</div>
                                            <div className="flex-1">
                                                <span className="font-bold text-gold uppercase text-[10px] tracking-widest mr-2">{log.action}</span>
                                                <span className="text-white/80">{JSON.stringify(log.details)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {loading && (
                            <div className="h-64 flex items-center justify-center text-white/40">
                                <div className="flex flex-col items-center gap-3">
                                    <RefreshCw className="w-8 h-8 animate-spin" />
                                    <p className="text-sm font-medium">Synchronizing Secure Data...</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${active
                    ? 'bg-gold text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
