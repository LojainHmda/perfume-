import React, { useEffect, useRef, useState } from 'react';
import { HAND_TIP_X, HAND_TIP_Y, HAND_VIEW_H, HAND_VIEW_W, LeatherHand } from './LeatherHand';

/**
 * The house cursor: one global leather hand, no per-component wiring.
 *
 * Everything that runs per frame writes straight to the DOM through refs.
 * React renders this component exactly twice in a session — once on mount, once
 * if the pointer capability changes — so mouse movement costs no reconciliation.
 */

/**
 * Rendered width in CSS pixels; height follows the artwork's aspect.
 *
 * The photographed gauntlet is a taller crop than the drawing it replaced
 * (444x814 against 180x260), so the width comes down to keep the cursor's
 * on-screen footprint where it was — about 99px tall rather than 121.
 */
const SIZE_W = 54;
const SIZE_H = (SIZE_W * HAND_VIEW_H) / HAND_VIEW_W;

/** Distance from the element's top-left corner to the drawn fingertip. */
const TIP_OFFSET_X = (HAND_TIP_X / HAND_VIEW_W) * SIZE_W;
const TIP_OFFSET_Y = (HAND_TIP_Y / HAND_VIEW_H) * SIZE_H;

/** Follow weight. Low enough to feel carried, high enough never to read as lag. */
const EASE = 0.24;
const MAX_TILT = 6;

/**
 * What counts as clickable. Deliberately structural — roles, semantics and the
 * pointer-cursor utility class — so no button has to opt in by hand, and plain
 * copy never lights up.
 */
const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'summary',
  'label[for]',
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="switch"]',
  '[role="option"]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
  '.cursor-pointer',
  '[data-cursor="interactive"]',
].join(',');

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const isDisabled = (el: Element) =>
  el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';

export const CustomCursor: React.FC = () => {
  // A real mouse or trackpad only. Touch screens keep their native behaviour.
  const [isPrecise, setIsPrecise] = useState(false);

  const layerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const ripplesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setIsPrecise(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isPrecise) return;

    const cursor = cursorRef.current;
    const hand = handRef.current;
    const ripples = ripplesRef.current;
    if (!cursor || !hand || !ripples) return;

    const shadow = hand.querySelector<SVGGElement>('.lhc-shadow');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    const velocity = { x: 0, y: 0 };

    let interactive = false;
    let revealed = false;
    let scrolled = false;
    let lastProbe = 0;
    let frame = 0;
    const timers = new Set<number>();

    const setInteractive = (next: boolean) => {
      if (next === interactive) return;
      interactive = next;
      cursor.classList.toggle('is-interactive', next);
    };

    const evaluate = (el: Element | null) => {
      const hit = el && 'closest' in el ? el.closest(INTERACTIVE_SELECTOR) : null;
      setInteractive(!!hit && !isDisabled(hit));
    };

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      cursor.classList.add('is-visible');
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      reveal();
      evaluate(e.target as Element | null);
    };

    // The page can move under a still pointer; re-probe what sits beneath it.
    const onScroll = () => {
      scrolled = true;
    };

    const onLeave = () => cursor.classList.remove('is-visible');
    const onEnter = () => {
      if (revealed) cursor.classList.add('is-visible');
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cursor.classList.add('is-pressing');
      spawnRipple(e.clientX, e.clientY);
    };

    const onPointerUp = () => cursor.classList.remove('is-pressing');

    /** Two concentric rings, fired once per click and reaped when they finish. */
    const spawnRipple = (x: number, y: number) => {
      if (reduceMotion) return;

      const make = (modifier?: string) => {
        const ring = document.createElement('span');
        ring.className = modifier ? `lhc-ripple ${modifier}` : 'lhc-ripple';
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        ripples.appendChild(ring);

        const remove = () => ring.remove();
        ring.addEventListener('animationend', remove, { once: true });
        // Safety net: an interrupted animation must not leak a node.
        const timer = window.setTimeout(() => {
          remove();
          timers.delete(timer);
        }, 1200);
        timers.add(timer);
      };

      make();
      make('lhc-ripple--trailing');
    };

    const tick = () => {
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;

      if (reduceMotion) {
        pos.x = target.x;
        pos.y = target.y;
      } else {
        pos.x += dx * EASE;
        pos.y += dy * EASE;
      }

      velocity.x = velocity.x * 0.82 + dx * 0.18;
      velocity.y = velocity.y * 0.82 + dy * 0.18;

      cursor.style.transform = `translate3d(${pos.x - TIP_OFFSET_X}px, ${pos.y - TIP_OFFSET_Y}px, 0)`;

      if (!reduceMotion) {
        // The hand swings from the fingertip, so the contact point never drifts.
        hand.style.transform = `rotate(${clamp(velocity.x * 0.22, -MAX_TILT, MAX_TILT)}deg)`;
        if (shadow) {
          shadow.style.transform = `translate(${clamp(-velocity.x * 0.35, -9, 9)}px, ${clamp(
            -velocity.y * 0.2,
            -5,
            5,
          )}px)`;
        }
      }

      if (scrolled) {
        const now = performance.now();
        if (now - lastProbe > 90) {
          lastProbe = now;
          scrolled = false;
          evaluate(document.elementFromPoint(target.x, target.y));
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    window.addEventListener('blur', onPointerUp);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('blur', onPointerUp);
      window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      timers.forEach((timer) => window.clearTimeout(timer));
      ripples.replaceChildren();
    };
  }, [isPrecise]);

  if (!isPrecise) return null;

  return (
    <div className="lhc-layer" ref={layerRef} aria-hidden="true">
      <div className="lhc-ripples" ref={ripplesRef} />
      <div className="lhc-cursor" ref={cursorRef}>
        <div className="lhc-hand" ref={handRef} style={{ width: SIZE_W, height: SIZE_H }}>
          <LeatherHand />
        </div>
      </div>
    </div>
  );
};
