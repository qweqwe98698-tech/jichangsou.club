import React, { useState } from 'react';
import type { Airport } from '../../types/airport';

interface DecisionWizardProps {
  airports: Airport[];
}

export default function DecisionWizard({ airports }: DecisionWizardProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    purpose: 'general',
    budget: 'mid',
    device: 'multi',
    priority: 'stability',
  });

  const stepTitles = [
    '您的主要用途是？',
    '您的月度预算范围？',
    '您的主力使用设备？',
    '您最看重哪项指标？',
  ];

  const purposes = [
    { id: 'general', label: '科学上网 / 全面访问', desc: '日常查资料、社交软件、普通网页' },
    { id: 'ai', label: 'ChatGPT / Claude 专用', desc: '需要原生独立 IP，防止被封或 Access Denied' },
    { id: 'streaming', label: '流媒体解锁 (Netflix/Disney)', desc: '港美日新原生 4K/8K 解锁与低缓冲' },
    { id: 'office', label: '跨境办公 / 学术开发', desc: 'GitHub、远程桌面、高 SLA 专线保障' },
    { id: 'budget_download', label: '轻量备用 / 大流量下载', desc: '追求超高每 GB 性价比与不限时计费' },
  ];

  const budgets = [
    { id: 'low', label: '¥10 以下 / 月', desc: '入门级轻量体验或备用' },
    { id: 'mid_low', label: '¥10 – 20 / 月', desc: '主流高性价比中转' },
    { id: 'mid_high', label: '¥20 – 40 / 月', desc: '高品质 IEPL / BGP 专线' },
    { id: 'high', label: '¥40+ / 月', desc: '企业级纯净专线与极速带宽' },
  ];

  const devices = [
    { id: 'windows_mac', label: 'Windows & macOS', desc: '支持 Clash Verge / v2rayN / sing-box' },
    { id: 'ios', label: 'iPhone / iPad (iOS)', desc: '支持 Shadowrocket (小火箭) / Loon / Surge' },
    { id: 'android', label: 'Android 手机与平板', desc: '支持 Clash Meta / v2rayNG / sing-box' },
    { id: 'multi', label: '全平台多设备同时在线', desc: '需要支持 3~5 台以上设备同时连接' },
  ];

  const priorities = [
    { id: 'stability', label: '极端稳定 · 晚高峰不卡顿', desc: '优先推荐全专线 IEPL 与 BGP 灾备' },
    { id: 'speed', label: '超高带宽 · 4K/8K 秒开', desc: '优先推荐千兆接入与低延迟节点' },
    { id: 'price', label: '价格亲民 · 单 GB 成本低', desc: '优先推荐大流量中转套餐' },
    { id: 'pure_ip', label: '纯净 IP · AI/流媒体不弹验证', desc: '优先推荐家宽原生独立出口' },
  ];

  // Logic to calculate recommendations based on user choices
  const getRecommendations = () => {
    return airports
      .map((airport) => {
        let score = 0;
        let reasons: string[] = [];

        // Purpose matching
        if (answers.purpose === 'ai' && airport.ai.chatgpt && airport.ai.claude) {
          score += 30;
          reasons.push('全节点原生支持 ChatGPT 与 Claude 网页及 API');
        } else if (answers.purpose === 'streaming' && airport.streaming.netflix) {
          score += 30;
          reasons.push('经实测支持全区流媒体 4K 超清解锁');
        } else if (answers.purpose === 'office' && airport.routes.some((r) => r.includes('专线'))) {
          score += 30;
          reasons.push('具备高 SLA 内网专线，跨境开发与办公稳定');
        } else if (answers.purpose === 'budget_download' && airport.price.startingMonthly < 20) {
          score += 30;
          reasons.push('低单价充裕流量，满足大吞吐量下载');
        } else {
          score += 15;
          reasons.push('综合线路覆盖全面，适配常规使用');
        }

        // Budget matching
        const price = airport.price.startingMonthly;
        if (answers.budget === 'low' && price <= 10) {
          score += 25;
          reasons.push('月费符合 ¥10 以下低预算');
        } else if (answers.budget === 'mid_low' && price >= 10 && price <= 20) {
          score += 25;
          reasons.push('月费处于 ¥10~20 主流性价比区间');
        } else if (answers.budget === 'mid_high' && price > 20 && price <= 40) {
          score += 25;
          reasons.push('月费符合 ¥20~40 高品质专线定位');
        } else if (answers.budget === 'high' && price > 40) {
          score += 25;
          reasons.push('月费属于高端企业级独立资源');
        } else {
          score += 10;
        }

        // Priority matching
        if (answers.priority === 'stability' && airport.routes.some((r) => r.includes('IEPL') || r.includes('专线'))) {
          score += 25;
          reasons.push('专线传输晚高峰丢包率极低');
        } else if (answers.priority === 'price' && airport.price.startingMonthly < 20) {
          score += 25;
          reasons.push('单位流量价格优势明显');
        } else if (answers.priority === 'pure_ip' && airport.ai.status === 'verified') {
          score += 25;
          reasons.push('出口纯净度高，极少弹 Cloudflare 验证');
        } else {
          score += 15;
        }

        return { airport, score, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({
      purpose: 'general',
      budget: 'mid',
      device: 'multi',
      priority: 'stability',
    });
  };

  return (
    <div id="decision-wizard" className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] p-5 sm:p-7 shadow-xl">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm">
            🧭
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              选机场决策向导
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {step <= 4 ? `STEP ${step} / 4` : '推荐结果'}
              </span>
            </h3>
            <p className="text-xs text-[var(--text-dim)]">根据真实需求与预算，输出符合条件的候选机场</p>
          </div>
        </div>

        {step > 1 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[var(--text-dim)] hover:text-emerald-400 transition-colors"
          >
            重新测试
          </button>
        )}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="space-y-3 animate-in fade-in">
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
            {stepTitles[0]}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {purposes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setAnswers({ ...answers, purpose: p.id })}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  answers.purpose === p.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-[var(--text-main)] ring-1 ring-emerald-500/30'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] mb-0.5">{p.label}</div>
                <div className="text-[11px] text-[var(--text-dim)]">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 animate-in fade-in">
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
            {stepTitles[1]}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {budgets.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setAnswers({ ...answers, budget: b.id })}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  answers.budget === b.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-[var(--text-main)] ring-1 ring-emerald-500/30'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] mb-0.5">{b.label}</div>
                <div className="text-[11px] text-[var(--text-dim)]">{b.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3 animate-in fade-in">
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
            {stepTitles[2]}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {devices.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setAnswers({ ...answers, device: d.id })}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  answers.device === d.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-[var(--text-main)] ring-1 ring-emerald-500/30'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] mb-0.5">{d.label}</div>
                <div className="text-[11px] text-[var(--text-dim)]">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3 animate-in fade-in">
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
            {stepTitles[3]}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {priorities.map((pr) => (
              <button
                key={pr.id}
                type="button"
                onClick={() => setAnswers({ ...answers, priority: pr.id })}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  answers.priority === pr.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-[var(--text-main)] ring-1 ring-emerald-500/30'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] mb-0.5">{pr.label}</div>
                <div className="text-[11px] text-[var(--text-dim)]">{pr.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step Navigation Buttons */}
      {step <= 4 ? (
        <div className="flex items-center justify-between pt-6 mt-4 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              step === 1
                ? 'opacity-40 cursor-not-allowed text-[var(--text-dim)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            上一步
          </button>

          <button
            type="button"
            onClick={() => {
              if (step === 4) {
                setStep(5); // Show result
              } else {
                handleNext();
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <span>{step === 4 ? '查看匹配结果' : '下一步 →'}</span>
          </button>
        </div>
      ) : (
        /* Output Result Cards */
        <div className="space-y-4 pt-2 animate-in fade-in">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            ✅ 已根据你的选择（{purposes.find((p) => p.id === answers.purpose)?.label} · {budgets.find((b) => b.id === answers.budget)?.label}）完成多维匹配。
          </div>

          <div className="space-y-3">
            {getRecommendations().map(({ airport, reasons }, idx) => (
              <div
                key={airport.id}
                className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-strong)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-500/20">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-[var(--text-main)]">{airport.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        ¥{airport.price.startingMonthly}/月起
                      </span>
                    </div>
                    <ul className="mt-1 space-y-0.5 text-xs text-[var(--text-dim)]">
                      {reasons.slice(0, 2).map((r, rIdx) => (
                        <li key={rIdx} className="flex items-center gap-1">
                          <span className="text-emerald-400">✓</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <a
                    href={`/airport/${airport.slug}/`}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] text-center font-medium transition-colors"
                  >
                    查看详情
                  </a>
                  <a
                    href={airport.affiliateUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold text-center transition-all shadow-sm"
                  >
                    直达官网
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-[var(--text-dim)] hover:text-emerald-400 underline transition-colors"
            >
              修改条件重新测试
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
