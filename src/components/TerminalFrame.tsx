'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Zap, Shield, Globe, Layers, Sigma,
  LayoutDashboard, Briefcase, Activity,
  Terminal, Menu, X, BookOpen, Cpu,
  Eye, Radio, Box, Building, Brain, Palette, FileSearch, Target
} from 'lucide-react'
import { BackgroundEffect } from './BackgroundEffect'
import { LanguageSwitcher } from './ui/LanguageSwitcher'
import { useTranslations } from '@/i18n'

// Navigation structure with translation keys
const getNavGroups = (t: ReturnType<typeof useTranslations>['t']) => [
  {
    titleKey: 'operations',
    title: t.nav.groups.operations,
    links: [
      { name: t.nav.links.goldTeam, path: '/', icon: <Radio size={16} /> },
      {
        name: t.nav.links.agentRedLeader,
        path: '/offense',
        icon: <Terminal size={16} />,
        customHover: "group-hover:text-red-500 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
      },
      {
        name: t.nav.links.agentBlueTeam,
        path: '/defense',
        icon: <Shield size={16} />,
        customHover: "group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
      },
      { name: t.nav.links.oxotVision, path: '/vision', icon: <Eye size={16} /> },
    ]
  },
  {
    titleKey: 'advisory',
    title: t.nav.groups.advisory,
    links: [
      { name: t.nav.links.nis2Compliance, path: '/nis2', icon: <Globe size={16} /> },
      { name: t.nav.links.iec62443Compliance, path: '/iec62443', icon: <LayoutDashboard size={16} /> },
      { name: t.nav.links.socIntegration, path: '/soc', icon: <Activity size={16} /> },
      { name: t.nav.links.madueDiligence, path: '/acquisitions', icon: <Briefcase size={16} /> },
      { name: t.nav.links.operatorPlaybook, path: '/playbook-operator', icon: <BookOpen size={16} /> },
      { name: t.nav.links.manufacturerGuide, path: '/playbook-manufacturer', icon: <Cpu size={16} /> },
    ]
  },
  {
    titleKey: 'coreSystems',
    title: t.nav.groups.coreSystems,
    links: [
      { name: t.nav.links.aeonCore, path: '/core', icon: <Activity size={16} /> },
      { name: t.nav.links.sevenLayerTwin, path: '/architecture', icon: <Layers size={16} /> },
      { name: t.nav.links.conceptHub, path: '/concepts', icon: <Box size={16} /> },
      { name: t.nav.links.appliedTheory, path: '/theory', icon: <Brain size={16} /> },
    ]
  },
  {
    titleKey: 'corporate',
    title: t.nav.groups.corporate,
    links: [
      { name: t.nav.links.aboutOxot, path: '/about', icon: <Building size={16} /> },
      { name: t.nav.links.strategicPlanning, path: '/corporate/strategic-planning', icon: <Briefcase size={16} />, customHover: "group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" },
      { name: t.nav.links.servicesPortfolio, path: '/corporate/services-portfolio', icon: <Activity size={16} /> },
      { name: t.nav.links.osintReport, path: '/corporate/osint-report', icon: <FileSearch size={16} />, customHover: "group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" },
      { name: t.nav.links.apiEnhancements, path: '/corporate/enhancements', icon: <Zap size={16} /> },
      { name: t.nav.links.brandingGuidelines, path: '/corporate/branding', icon: <Palette size={16} />, customHover: "group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" },
      { name: t.nav.links.businessPitchDeck, path: '/corporate/pitch-deck', icon: <Layers size={16} />, customHover: "group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" },

    ]
  },
  {
    titleKey: 'campaigns',
    title: t.nav.groups.campaigns,
    links: [
      { name: t.nav.links.campaignDashboard, path: '/campaigns', icon: <LayoutDashboard size={16} />, customHover: "group-hover:text-oxot-gold group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" },
      { name: t.nav.links.frieslandCampina, path: '/campaigns/friesland-campina', icon: <Target size={16} />, customHover: "group-hover:text-oxot-gold group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" },
    ]
  }
]

export default function TerminalFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const { t } = useTranslations()

  const NAV_GROUPS = getNavGroups(t)

  return (
    <div className="relative min-h-screen p-0 flex flex-col md:flex-row overflow-hidden bg-black">

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-6 right-6 z-[100] p-3 bg-oxot-gold text-black rounded-full shadow-2xl"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Proportional & Professional */}
      <aside className={`
        fixed inset-0 z-[90] bg-black border-r border-white/5 md:relative md:inset-auto
        w-full md:w-[300px] h-screen flex flex-col transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-10 border-b border-white/5">
          <Link href="/" className="block group">

            {/* User Requested Logo (Black Background v3) */}
            <div className="mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logos_OXOT_Gold_White/OXOT_GW_Dark.svg"
                alt="OXOT Sovereign Intelligence"
                className="w-40 h-auto opacity-100 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-grey tracking-[0.4em] font-medium uppercase group-hover:text-white transition-colors">
                {t.brand.tagline}
              </div>
              <div className="text-[9px] font-mono text-oxot-gold tracking-[0.2em] font-bold uppercase">
                {t.brand.uplinkLocation}
              </div>
            </div>
          </Link>

          {/* Language Switcher - Below logo */}
          <div className="mt-6">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Navigation - Clean Hierarchy */}
        <nav className="flex-1 overflow-y-auto px-8 py-8 space-y-10 scrollbar-hide">
          {NAV_GROUPS.map((group, i) => (
            <div key={i} className="space-y-4">
              {/* Reduced size headers as requested */}
              <h3 className="text-[9px] font-mono text-white/30 uppercase tracking-[0.1em] font-bold pl-1 border-l border-white/5">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.links.map((link: any) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 p-2 rounded-lg transition-all group relative
                      ${pathname === link.path
                        ? 'text-white'
                        : 'text-gray-500 hover:text-white'}
                    `}
                  >
                    <span className={`
                      transition-all duration-300
                      ${pathname === link.path ? 'text-oxot-gold' : `text-gray-600 ${link.customHover || 'group-hover:text-oxot-gold'}`}
                    `}>
                      {link.icon}
                    </span>
                    <span className="text-[11px] tracking-widest uppercase font-medium">
                      {link.name}
                    </span>
                    {pathname === link.path && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute left-[-18px] w-0.5 h-1/2 bg-oxot-gold rounded-full"
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Mission */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="text-[11px] font-mono text-grey uppercase tracking-widest leading-relaxed font-bold">
            {t.brand.mission}<br />
            <span className="text-white opacity-60 mt-1 block">{t.brand.missionSub}</span>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 relative z-10 bg-transparent h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* Background Effect and Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <BackgroundEffect />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none"></div>
        </div>

        <div className="p-8 md:p-16 lg:p-20 max-w-[1400px] mx-auto min-h-screen relative z-10">
          {/* Status Header */}
          <div className="flex justify-between items-center mb-20 opacity-20 pointer-events-none hidden md:flex font-mono text-[10px] uppercase tracking-[0.4em]">
            <div className="flex gap-12">
              <div>{t.brand.secureLattice}</div>
              <div>{t.brand.handshake}</div>
            </div>
            <div>{t.brand.copyright}</div>
          </div>

          <div className="relative z-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}