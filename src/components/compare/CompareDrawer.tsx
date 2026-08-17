import React, { useState, useEffect } from 'react';
import type { Airport } from '../../types/airport';

export default function CompareDrawer() {
  const [selectedAirports, setSelectedAirports] = useState<Airport[]>([]);

  useEffect(() => {
    // Read from localStorage on mount
    try {
      const saved = localStorage.getItem('jcs-compare-list');
      if (saved) {
        setSelectedAirports(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }

    // Custom event listener for adding/removing airports
    const handleCompareUpdate = (e: CustomEvent<Airport>) => {
      const airport = e.detail;
      setSelectedAirports((prev) => {
        const exists = prev.some((a) => a.id === airport.id);
        let updated: Airport[];
        if (exists) {
          updated = prev.filter((a) => a.id !== airport.id);
        } else {
          if (prev.length >= 4) {
            alert('最多支持同时对比 4 家机场');
            return prev;
          }
          updated = [...prev, airport];
        }
        localStorage.setItem('jcs-compare-list', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('jcs:compare:toggle' as any, handleCompareUpdate);
    return () => {
      window.removeEventListener('jcs:compare:toggle' as any, handleCompareUpdate);
    };
  }, []);

  const removeAirport = (id: string) => {
    const updated = selectedAirports.filter((a) => a.id !== id);
    setSelectedAirports(updated);
    localStorage.setItem('jcs-compare-list', JSON.stringify(updated));
  };

  const clearAll = () => {
    setSelectedAirports([]);
    localStorage.removeItem('jcs-compare-list');
  };

  if (selectedAirports.length === 0) return null;

  return (
    <aside aria-label="机场对比控制栏" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-3xl bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] rounded-2xl shadow-2xl p-3 sm:p-4 backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Selected Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold whitespace-nowrap">
            <span>对比盘 ({selectedAirports.length}/4)</span>
          </div>

          {selectedAirports.map((airport) => (
            <div
              key={airport.id}
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] whitespace-nowrap group hover:border-emerald-500/50 transition-all"
            >
              <span className="font-medium">{airport.name}</span>
              <span className="text-[10px] text-emerald-400 font-mono">¥{airport.price.startingMonthly}/月</span>
              <button
                type="button"
                onClick={() => removeAirport(airport.id)}
                className="text-[var(--text-dim)] hover:text-red-400 p-0.5 rounded transition-colors"
                title="移除"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={clearAll}
            className="hidden sm:inline-block px-2.5 py-1.5 rounded-lg text-xs text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-colors"
          >
            清空
          </button>

          <a
            href={`/compare/?ids=${selectedAirports.map((a) => a.id).join(',')}`}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-md hover:shadow-emerald-900/40 transition-all active:scale-95"
          >
            <span>立即对比 ({selectedAirports.length})</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}
