import React from 'react';
import { Users, CheckCircle2, AlertTriangle, Coins } from 'lucide-react';

function Card({ icon: Icon, label, value, accentClass }) {
  return (
    <div className="bg-base-900 border border-base-700 rounded-2xl p-5 shadow-panel">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
          {label}
        </span>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${accentClass}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-zinc-100 font-mono">{value}</p>
    </div>
  );
}

export default function MetricCards({ profiles }) {
  const total = profiles.length;
  const active = profiles.filter((p) => p.status === 'active').length;
  const review = profiles.filter((p) => p.status === 'review').length;
  const credits = profiles.reduce((sum, p) => sum + (Number(p.credits) || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={Users}
        label="Total de perfiles"
        value={total}
        accentClass="bg-zinc-500/10 text-zinc-300"
      />
      <Card
        icon={CheckCircle2}
        label="Perfiles activos"
        value={active}
        accentClass="bg-emerald-500/10 text-emerald-400"
      />
      <Card
        icon={AlertTriangle}
        label="En revisión"
        value={review}
        accentClass="bg-amber-500/10 text-amber-400"
      />
      <Card
        icon={Coins}
        label="Créditos disponibles"
        value={credits.toLocaleString('es-ES')}
        accentClass="bg-accent/10 text-accent"
      />
    </div>
  );
}
