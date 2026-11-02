'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onSessionExpired } from '@/api/client';
import { getCurrentUser, logout } from '@/data/auth/authService';
import type { User } from '@/data/auth/types';
import { syncPending } from '@/data/learning/learningService';
import { sessionStore } from '@/storage/sessionStore';
import { STORAGE_KEYS } from '@/storage/keys';
import { SESSION_CONFIG } from './sessionConfig';
import { SessionExpiredModal, SessionWarningModal } from './SessionModals';

/** idle = no activity; expired = time limit reached or token rejected by the server. */
export type ExpiredReason = 'idle' | 'expired';

interface SessionContextValue {
  user: User | null;
  /** False until the cached session has been read from storage. */
  ready: boolean;
  /** Call after login / verification / profile edits. */
  setUser: (user: User | null) => void;
  signOut: (reason?: ExpiredReason | null) => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'] as const;

/**
 * Holds the logged-in student and enforces the session timeouts in
 * sessionConfig.ts while they are inside the web app (/app). Like the mobile
 * SessionManager, a 401 from the server (see api/client.ts) also ends the
 * session. Logging out in one tab logs out every tab.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [expiredReason, setExpiredReason] = useState<ExpiredReason | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const lastActivityAt = useRef(0);
  const loggingOutRef = useRef(false);

  const inApp = pathname?.startsWith(SESSION_CONFIG.authenticatedPrefix) ?? false;
  const authenticated = !!user && inApp;

  useEffect(() => {
    Promise.all([getCurrentUser(), sessionStore.getAccessToken()]).then(([cached, token]) => {
      setUser(cached && token ? cached : null);
      setReady(true);
    });
  }, []);

  const signOut = useCallback(
    async (reason: ExpiredReason | null = null) => {
      if (loggingOutRef.current) return;
      loggingOutRef.current = true;
      setLoggingOut(true);
      await logout();
      setUser(null);
      setWarningVisible(false);
      setExpiredReason(reason);
      router.replace(SESSION_CONFIG.loggedOutRoute);
      setLoggingOut(false);
      loggingOutRef.current = false;
    },
    [router],
  );

  // Idle + absolute timeouts.
  useEffect(() => {
    if (!authenticated) return;
    lastActivityAt.current = Date.now();
    const { idleTimeoutMs, warningDurationMs, maxSessionMs } = SESSION_CONFIG;
    let startedAt: number | null = null;
    sessionStore.getStartedAt().then(value => (startedAt = value));

    const markActivity = () => {
      // Activity doesn't dismiss the warning; the student must answer it.
      if (Date.now() - lastActivityAt.current < idleTimeoutMs) lastActivityAt.current = Date.now();
    };

    const check = () => {
      if (loggingOutRef.current) return;
      const now = Date.now();
      if (startedAt && now - startedAt >= maxSessionMs) {
        signOut('expired');
        return;
      }
      const idleFor = now - lastActivityAt.current;
      if (idleFor >= idleTimeoutMs + warningDurationMs) {
        signOut('idle');
      } else if (idleFor >= idleTimeoutMs) {
        setSecondsLeft(Math.ceil((idleTimeoutMs + warningDurationMs - idleFor) / 1000));
        setWarningVisible(true);
      }
    };

    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, markActivity, { passive: true }));
    document.addEventListener('visibilitychange', check);
    const interval = setInterval(check, 1000);
    return () => {
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, markActivity));
      document.removeEventListener('visibilitychange', check);
      clearInterval(interval);
      setWarningVisible(false);
    };
  }, [authenticated, signOut]);

  // Token rejected by the server.
  useEffect(
    () =>
      onSessionExpired(() => {
        if (user) signOut('expired');
      }),
    [user, signOut],
  );

  // Logged out (or in) from another tab.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEYS.accessToken) return;
      if (!e.newValue) {
        setUser(null);
        if (inApp) router.replace(SESSION_CONFIG.loggedOutRoute);
      } else {
        getCurrentUser().then(setUser);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [inApp, router]);

  // Send reports / feedback queued while offline.
  useEffect(() => {
    if (!user) return;
    syncPending();
    window.addEventListener('online', syncPending);
    return () => window.removeEventListener('online', syncPending);
  }, [user]);

  return (
    <SessionContext.Provider value={{ user, ready, setUser, signOut }}>
      {children}
      <SessionWarningModal
        visible={warningVisible && authenticated}
        secondsLeft={secondsLeft}
        loggingOut={loggingOut}
        onStay={() => {
          lastActivityAt.current = Date.now();
          setWarningVisible(false);
        }}
        onLogout={() => signOut(null)}
      />
      <SessionExpiredModal reason={expiredReason} onDismiss={() => setExpiredReason(null)} />
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within a SessionProvider');
  return context;
};
