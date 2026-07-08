import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../lib/axios';

const SESSION_KEY = 'rv_session_id';
const DEBOUNCE_MS = 30000; // 30 seconds

// Generate a simple session ID
function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export default function usePageviewTracking() {
  const location = useLocation();
  const lastSentRef = useRef({});
  const sessionId = getSessionId();

  useEffect(() => {
    const path = location.pathname;
    const now = Date.now();
    const lastSent = lastSentRef.current[path];

    // Debounce: don't send if we already sent this path within DEBOUNCE_MS
    if (lastSent && now - lastSent < DEBOUNCE_MS) {
      return;
    }

    lastSentRef.current[path] = now;

    const payload = {
      path,
      sessionId,
      referrer: document.referrer || '',
    };

    // Fire and forget — no need to await or handle errors
    api.post('/analytics/pageview', payload).catch(() => {
      // Silently fail — tracking should never break the user experience
    });
  }, [location.pathname, sessionId]);
}
