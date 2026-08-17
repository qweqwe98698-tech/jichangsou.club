import React, { useState, useMemo } from 'react';
import type { Airport } from '../../types/airport';

interface HeroSearchProps {
  airports: Airport[];
}

type SearchMode = 'search' | 'inspect' | 'compare' | 'select';

const searchModeConfigs = {
  search: {
    label: '搜机场',
    placeholder: '输入机场名称 / 关键词 / 节点 / 使用场景……',
    actionText: '搜索机场',
  },
  inspect: {
    label: '查机场',
    placeholder: '输入机场名称查看真实核验资料、线路与套餐……',
    actionText: '查看资料',
  },
  compare: {
    label: '比机场',
    placeholder: '输入两个机场名称开始比较（例如：极光 vs 星云）……',
    actionText: '开始对比',
  },
  select: {
    label: '选机场',
    placeholder: '告诉我们你的用途和预算（例如：ChatGPT 20元以内）……',
    actionText: '智能推荐',
  },
};

const hotKeywords = [
  { text: '新手怎么选', query: '入门' },
  { text: '稳定高速', query: '专线' },
  { text: '性价比高', query: '性价比' },
  { text: 'Netflix 解锁', query: 'Netflix' },
  { text: 'ChatGPT 解锁', query: 'ChatGPT' },
  { text: 'IEPL 专线', query: 'IEPL' },
  { text: 'Clash 订阅', query: 'Clash' },
  { text: 'Shadowrocket', query: 'Shadowrocket' },
];

export default function HeroSearch({ airports }: HeroSearchProps) {
  const [activeMode, setActiveMode] = useState<SearchMode>('search');
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filter suggestion results
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return airports.filter((airport) => {
      const matchName = airport.name.toLowerCase().includes(q);
      const matchTagline = airport.tagline.toLowerCase().includes(q);
      const matchRoutes = airport.routes.some((r) => r.toLowerCase().includes(q));
      const matchProtocols = airport.protocols.some((p) => p.toLowerCase().includes(q));
      const matchClients = airport.clients.some((c) => c.toLowerCase().includes(q));
      const matchRegions = airport.regions.some((reg) => reg.toLowerCase().includes(q));
      const matchAdv = airport.advantages.some((a) => a.toLowerCase().includes(q));
      return matchName || matchTagline || matchRoutes || matchProtocols || matchClients || matchRegions || matchAdv;
    });
  }, [query, airports]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      window.location.href = '/airports/';
      return;
    }
    if (activeMode === 'compare') {
      window.location.href = `/compare/?q=${encodeURIComponent(query)}`;
    } else if (activeMode === 'select') {
      const wizardEl = document.getElementById('decision-wizard');
      if (wizardEl) {
        wizardEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#decision-wizard';
      }
    } else {
      window.location.href = `/airports/?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div id="hero-search" className="w-full max-w-4xl mx-auto">
      {/* Search Mode Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(searchModeConfigs) as SearchMode[]).map((mode) => {
          const config = searchModeConfigs[mode];
          const isActive = activeMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setActiveMode(mode);
                if (mode === 'select') {
                  const wizardEl = document.getElementById('decision-wizard');
                  if (wizardEl) wizardEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-950/30'
                  : 'bg-[var(--bg-surface)]/80 text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)]'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Search Input Container */}
      <div className="relative">
        <form
          onSubmit={handleSubmit}
          className={`flex items-center w-full bg-[var(--bg-surface)] border rounded-2xl p-1.5 sm:p-2 transition-all duration-300 shadow-xl ${
            isFocused
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-950/50'
              : 'border-[var(--border-strong)] hover:border-emerald-500/40'
          }`}
        >
          {/* Search Icon */}
          <div className="pl-3 sm:pl-4 pr-2 text-[var(--text-dim)]">
            <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 250)}
            placeholder={searchModeConfigs[activeMode].placeholder}
            className="flex-1 bg-transparent border-none text-[var(--text-main)] placeholder:text-[var(--text-dim)] text-xs sm:text-base focus:outline-none px-2 py-2"
          />

          {/* Action Button */}
          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <span>{searchModeConfigs[activeMode].actionText}</span>
          </button>
        </form>

        {/* Live Auto-Suggestions Dropdown */}
        {isFocused && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
            <div className="p-2 border-b border-[var(--border-subtle)] text-[11px] text-[var(--text-dim)] flex items-center justify-between">
              <span>找到 {suggestions.length} 家匹配机场</span>
              <span className="text-[10px]">点击直接查看核验资料</span>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
              {suggestions.map((airport) => (
                <a
                  key={airport.id}
                  href={`/airport/${airport.slug}/`}
                  className="flex items-center justify-between p-3 hover:bg-[var(--bg-card-hover)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                      {airport.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--text-main)] group-hover:text-emerald-400 flex items-center gap-2">
                        {airport.name}
                        {airport.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {airport.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--text-dim)]">{airport.tagline}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-400 font-mono">
                      ¥{airport.price.startingMonthly}/月起
                    </div>
                    <div className="text-[10px] text-[var(--text-dim)]">最近核验：{airport.lastVerified}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hot Search Chips */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-[var(--text-dim)]">
        <span className="font-medium text-[var(--text-muted)] flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
          热门搜索：
        </span>
        {hotKeywords.map((item) => (
          <button
            key={item.text}
            type="button"
            onClick={() => {
              setQuery(item.query);
              window.location.href = `/airports/?q=${encodeURIComponent(item.query)}`;
            }}
            className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-[var(--bg-card)] transition-all cursor-pointer text-[11px] sm:text-xs"
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  );
}
