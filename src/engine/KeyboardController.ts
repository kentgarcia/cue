export interface KeyboardActions {
  next: () => void;
  previous: () => void;
  first: () => void;
  last: () => void;
  fullscreen: () => void;
  escape: () => boolean;
}

export function bindKeyboard(actions: KeyboardActions): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.isComposing
    )
      return;
    const target = event.target;
    if (target instanceof Element && target.closest('dialog, [role="dialog"]'))
      return;
    if (event.key === "Escape") {
      if (actions.escape()) event.preventDefault();
      return;
    }
    if (
      target instanceof Element &&
      target.closest(
        'input, textarea, select, button, a, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="textbox"], [role="dialog"]',
      )
    )
      return;
    const handlers: Record<string, (() => void) | undefined> = {
      ArrowRight: actions.next,
      ArrowLeft: actions.previous,
      " ": actions.next,
      Enter: actions.next,
      Home: actions.first,
      End: actions.last,
      f: actions.fullscreen,
      F: actions.fullscreen,
    };
    const action = handlers[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}
