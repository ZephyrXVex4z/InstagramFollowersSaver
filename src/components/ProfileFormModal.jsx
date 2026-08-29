import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config.js';
import { STATIONS } from './statusMeta.js';

const EMPTY_FORM = {
  clientName: '',
  socialUsername: '',
  socialPassword: '',
  recoveryEmail: '',
  recoveryEmailPassword: '',
  station: STATIONS[0],
  proxyIp: '',
  status: 'active',
  credits: 0,
};

export default function ProfileFormModal({ initialProfile, onClose }) {
  const isEditing = Boolean(initialProfile);
  const [form, setForm] = useState(
    initialProfile
      ? { ...EMPTY_FORM, ...initialProfile }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.socialUsername.trim()) {
      setError('El @usuario de la red social es obligatorio.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        const { id, createdAt, ...rest } = form;
        await updateDoc(doc(db, 'profiles', initialProfile.id), {
          ...rest,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'profiles'), {
          ...form,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          statusChangedAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el perfil. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-6 overflow-y-auto">
      <div className="bg-base-900 border border-base-700 rounded-2xl shadow-panel w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-700">
          <h3 className="font-semibold text-zinc-100">
            {isEditing ? 'Editar perfil' : 'Añadir perfil'}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <Field label="Cliente (referencia interna)">
            <input
              value={form.clientName}
              onChange={update('clientName')}
              placeholder="Ej. Cliente / Marca"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="@Usuario de la red social">
              <input
                value={form.socialUsername}
                onChange={update('socialUsername')}
                placeholder="usuario_ig"
                className="input"
                required
              />
            </Field>
            <Field label="Contraseña de la cuenta">
              <input
                value={form.socialPassword}
                onChange={update('socialPassword')}
                type="text"
                className="input font-mono"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Correo de recuperación">
              <input
                value={form.recoveryEmail}
                onChange={update('recoveryEmail')}
                type="email"
                placeholder="correo@dominio.com"
                className="input"
              />
            </Field>
            <Field label="Contraseña del correo">
              <input
                value={form.recoveryEmailPassword}
                onChange={update('recoveryEmailPassword')}
                type="text"
                className="input font-mono"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Estación / dispositivo">
              <select value={form.station} onChange={update('station')} className="input">
                {STATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Proxy / IP asignada">
              <input
                value={form.proxyIp}
                onChange={update('proxyIp')}
                placeholder="000.000.000.000"
                className="input font-mono"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Estado de la cuenta">
              <select value={form.status} onChange={update('status')} className="input">
                <option value="active">Activo/Verificado</option>
                <option value="review">En Pausa/Revisión</option>
                <option value="blocked">Desconectado/Bloqueado</option>
              </select>
            </Field>
            <Field label="Créditos de campaña">
              <input
                value={form.credits}
                onChange={update('credits')}
                type="number"
                min="0"
                className="input"
              />
            </Field>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg text-zinc-400 hover:text-zinc-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-accent text-base-950 font-medium hover:bg-accent/90 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar perfil
            </button>
          </div>
        </form>
      </div>

      {/* Utility class shim: keeps input styling consistent without repeating classNames everywhere */}
      <style>{`
        .input {
          width: 100%;
          background-color: #141417;
          border: 1px solid #27272e;
          border-radius: 0.5rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: #e4e4e7;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(63, 208, 201, 0.4);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-zinc-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
