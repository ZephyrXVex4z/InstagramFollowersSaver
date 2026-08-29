import React from 'react';
import { LayoutGrid, Users, Ticket, ShieldCheck, LogOut, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Resumen', icon: LayoutGrid },
  { id: 'profiles', label: 'Perfiles', icon: Users },
  { id: 'coupons', label: 'Cupones', icon: Ticket },
];

export default function Sidebar({ active, onNavigate, onLogout, user, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Overlay móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-base-900 border-r border-base-700 flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-base-700">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-accent/10 border border-accent/30 flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
              Vault
            </span>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-zinc-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-base-800 border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-base-700">
          <div className="px-3 mb-3">
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            <p className="text-[10px] text-zinc-700 font-mono uppercase mt-0.5">
              Administrador
            </p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
