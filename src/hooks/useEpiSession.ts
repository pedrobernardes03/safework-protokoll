/**
 * useEpiSession
 *
 * Persiste as marcações de EPIs e o estado de confirmação no localStorage
 * com uma janela de sessão de 12 horas por matrícula.
 */

import { useState, useCallback } from "react";

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 horas
const STORAGE_KEY_PREFIX = "safework_epi_session_";

interface EpiSessionData {
  matricula: string;
  checked: Record<string, boolean>;
  submitted: boolean;
  expiresAt: number;
}

function buildKey(matricula: string) {
  return `${STORAGE_KEY_PREFIX}${matricula}`;
}

function loadSession(matricula: string): EpiSessionData | null {
  try {
    const raw = localStorage.getItem(buildKey(matricula));
    if (!raw) return null;
    const data: EpiSessionData = JSON.parse(raw);
    // Sessão expirada → descarta
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(buildKey(matricula));
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveSession(data: EpiSessionData) {
  try {
    localStorage.setItem(buildKey(data.matricula), JSON.stringify(data));
  } catch {
    // localStorage pode estar indisponível
  }
}

export function useEpiSession(matricula: string) {
  const [session, setSession] = useState<EpiSessionData>(() => {
    const existing = loadSession(matricula);
    if (existing) return existing;
    return {
      matricula,
      checked: {},
      submitted: false,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
  });

  const setChecked = useCallback(
    (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => {
      setSession((prev) => {
        const newChecked = updater(prev.checked);
        const updated: EpiSessionData = {
          ...prev,
          checked: newChecked,
          expiresAt:
            prev.expiresAt > Date.now()
              ? prev.expiresAt
              : Date.now() + SESSION_DURATION_MS,
        };
        saveSession(updated);
        return updated;
      });
    },
    [],
  );

  const setSubmitted = useCallback((value: boolean) => {
    setSession((prev) => {
      const updated: EpiSessionData = { ...prev, submitted: value };
      saveSession(updated);
      return updated;
    });
  }, []);

  /** Limpa a sessão (ex: logout) */
  const clearSession = useCallback(() => {
    localStorage.removeItem(buildKey(matricula));
    setSession({
      matricula,
      checked: {},
      submitted: false,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });
  }, [matricula]);

  /** Tempo restante formatado "Xh Ym" */
  const timeRemaining = (() => {
    const diff = session.expiresAt - Date.now();
    if (diff <= 0) return null;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
  })();

  return {
    checked: session.checked,
    submitted: session.submitted,
    setChecked,
    setSubmitted,
    clearSession,
    timeRemaining,
    expiresAt: session.expiresAt,
  };
}
