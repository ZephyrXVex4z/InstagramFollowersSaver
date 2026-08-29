import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';

export default function Login({ onLogin, authError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onLogin(email, password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-950 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-accent" />
          </div>
          <span className="font-mono text-sm tracking-widest text-zinc-400 uppercase">
            Vault Access
          </span>
        </div>

        <div className="bg-base-900 border border-base-700 rounded-2xl shadow-panel p-6 sm:p-8">
          <h1 className="text-lg font-semibold text-zinc-100 mb-1">
            Acceso de administrador
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            Panel privado. Solo personal autorizado de la agencia.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                Correo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tuagencia.com"
                  className="w-full bg-base-850 border border-base-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-base-850 border border-base-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
                />
              </div>
            </div>

            {authError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-accent text-base-950 font-medium text-sm rounded-lg py-2.5 hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Iniciar sesión
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-zinc-700 mt-6 font-mono">
          Las cuentas se crean manualmente desde Firebase Authentication.
        </p>
      </div>
    </div>
  );
}
