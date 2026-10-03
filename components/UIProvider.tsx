'use client';

/* App-wide overlay state: the event drawer and toasts. Mounted once in the root layout so
   they persist across client-side navigation. */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { PROVINCES, VENUES } from '@/lib/data';
import { fmt } from '@/lib/dates';
import { TYPE_LABEL, bySlug, event as findEvent } from '@/lib/queries';
import type { Event } from '@/lib/types';
import { Icon } from './Icons';
import { Avatar, ProvinceTag, RisingTag } from './ui';

type Ctx = { openEvent: (id: string) => void; toast: (msg: string) => void; close: () => void };
const UICtx = createContext<Ctx | null>(null);
export const useUI = () => {
  const c = useContext(UICtx);
  if (!c) throw new Error('useUI must be used inside <UIProvider>');
  return c;
};

type Toast = { id: number; msg: string; open: boolean };

export function UIProvider({ children }: { children: ReactNode }) {
  const [ev, setEv] = useState<Event | null>(null);
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = '';
    lastFocus.current?.focus?.({ preventScroll: true });
  }, []);

  const openEvent = useCallback((id: string) => {
    const e = findEvent(id);
    if (!e) return;
    lastFocus.current = document.activeElement as HTMLElement;
    setEv(e);
    setOpen(true);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeBtn.current?.focus({ preventScroll: true }));
  }, []);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, open: false }]);
    requestAnimationFrame(() => requestAnimationFrame(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, open: true } : x)))));
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, open: false } : x))), 2600);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2900);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  // Navigating away closes the drawer
  useEffect(() => { if (open) close(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pathname]);

  const v = ev ? VENUES[ev.venue] : null;

  return (
    <UICtx.Provider value={{ openEvent, toast, close }}>
      {children}

      <div className="scrim" data-open={open} onClick={close} />
      <aside className="drawer" data-open={open} role="dialog" aria-modal="true" aria-labelledby="drawer-title" aria-hidden={!open}>
        <div className="drawer-head">
          <span className="eyebrow" style={{ margin: 0 }}>{ev ? TYPE_LABEL[ev.type] : ''}</span>
          <button className="icon-btn" ref={closeBtn} onClick={close} aria-label="Close"><Icon.close /></button>
        </div>
        {ev && v && (
          <div className="drawer-body">
            <div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <ProvinceTag id={v.province} />
                <span className="tag">{fmt.relative(ev.date)}</span>
                {ev.soldOut && <span className="tag tag-soldout">Sold out</span>}
              </div>
              <h2 id="drawer-title">{ev.title}</h2>
            </div>
            {ev.blurb && <p className="lead">{ev.blurb}</p>}
            <div className="drawer-section"><h4>When</h4><p><strong>{fmt.long(ev.date)}</strong><br /><span className="muted">Doors {ev.time}</span></p></div>
            <div className="drawer-section"><h4>Where</h4><p><strong>{v.name}</strong><br /><span className="muted">{v.area} · {PROVINCES[v.province].name}</span></p></div>
            <div className="drawer-section">
              <h4>Line-up</h4>
              <div className="lineup-list">
                {ev.lineup.map((s) => { const c = bySlug[s]; return (
                  <Link key={s} className="lineup-item" href={`/comedians/${s}`}>
                    <Avatar c={c} /><span className="name">{c.name}</span>{c.upcoming && <span style={{ marginLeft: 'auto' }}><RisingTag /></span>}
                  </Link>
                ); })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {ev.soldOut
                ? <button className="btn btn-ghost" disabled>Sold out</button>
                : <button className="btn btn-primary" onClick={() => toast('Tickets coming soon. Practise your queueing.')}><Icon.ticket />Tickets · {fmt.rand(ev.price)}</button>}
              <span className="small muted">Ticket links arrive once the venues join the cult.</span>
            </div>
          </div>
        )}
      </aside>

      <div className="toast-region">
        {toasts.map((t) => <div key={t.id} className="toast" data-open={t.open}><Icon.check /><span>{t.msg}</span></div>)}
      </div>
    </UICtx.Provider>
  );
}
