import { AlertTriangle, CheckCircle, Info, ExternalLink, Shield } from 'lucide-react';
import type { RiskLevel } from '../../stores/useCosmicStore';

interface ScanReasonsProps {
  reasons: string[];
  level: RiskLevel;
  score: number;
  txId?: string;
}

const levelConfig = {
  safe:    { icon: CheckCircle,    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Safe'    },
  warning: { icon: AlertTriangle,  color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   label: 'Warning' },
  danger:  { icon: AlertTriangle,  color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20',     label: 'Danger'  },
};

export function ScanReasons({ reasons, level, score, txId }: ScanReasonsProps) {
  const cfg = levelConfig[level];
  const Icon = cfg.icon;

  if (!reasons || reasons.length === 0) return null;

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5 mt-4 space-y-3 backdrop-blur-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={18} className={cfg.color} />
          <span className={`font-bold text-sm uppercase tracking-wider ${cfg.color}`}>{cfg.label} — Score {score}/100</span>
        </div>
        {txId && (
          <a
            href={`https://testnet.algoexplorer.io/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Shield size={12} />
            On-chain
            <ExternalLink size={11} />
          </a>
        )}
      </div>

      {/* Reason bullets */}
      <ul className="space-y-1.5">
        {reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/75">
            <Info size={14} className={`${cfg.color} flex-shrink-0 mt-0.5`} />
            <span>{reason}</span>
          </li>
        ))}
      </ul>

      {/* On-chain hash notice */}
      {txId && (
        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-white/40 font-mono break-all">
            Stored on Algorand: {txId}
          </p>
        </div>
      )}
    </div>
  );
}

export default ScanReasons;
