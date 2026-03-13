import { useEffect } from "react";

interface ShortcutOptions {
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
  enabled?: boolean;
};

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
) {
  const {
    meta,
    ctrl,
    shift,
    alt,
    preventDefault = true,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Ignore typing fields
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (meta === undefined || e.metaKey === meta) &&
        (ctrl === undefined || e.ctrlKey === ctrl) &&
        (shift === undefined || e.shiftKey === shift) &&
        (alt === undefined || e.altKey === alt)
      ) {
        if (preventDefault) e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [key, callback, meta, ctrl, shift, alt, preventDefault, enabled]);
}