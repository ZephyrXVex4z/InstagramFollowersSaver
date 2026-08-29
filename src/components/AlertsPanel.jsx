import React from 'react';
import { Bell, Circle } from 'lucide-react';
import { STATUS_META } from './statusMeta.js';

const ALERT_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 horas

export default function AlertsPanel({ profiles }) {
  const recentChanges = profiles
    .filter((p) => p.statusChangedAt)
    .filter((p) => Date.now() - p.statusChangedAt.toMillis() < ALERT_WINDOW_MS)
    .sort((a, b) => b.statusChangedAt.toMillis() - a.statusChangedAt.toMillis())
    .slice(0, 6);

  return (
    <div className="bg-base-900 border border-base-700 rounded-2xl p-5 shadow-panel">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-4 w-4 text-zinc-500" />
        <h2 className="text-sm font-semibold text-zinc-200">Alertas rápidas</h2>
      </div>

      {recentChanges.length === 0 ? (
        <p className="text-sm text-zinc-600">
          Sin cambios de estado en las últimas 48 horas.
        </p>
      ) : (
        <ul className="space-y-3">
          {recentChanges.map((p) => {
            const meta = STATUS_META[p.status] ?? STATUS_META.review;
            return (
              <li key={p.id} className="flex items-start gap-3">
                <Circle className={`h-2 w-2 mt-1.5 fill-current ${meta.dot}`} />
                <div className="min-w-0">
                  <p className="text-sm text-zinc-300 truncate">
                    <span className="font-medium">@{p.socialUsername || 'sin-usuario'}</span>{' '}
                    cambió a{' '}
                    <span className={meta.text}>{meta.label}</span>
                  </p>
                  <p className="text-xs text-zinc-600">
                    {p.statusChangedAt.toDate().toLocaleString('es-ES')}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
