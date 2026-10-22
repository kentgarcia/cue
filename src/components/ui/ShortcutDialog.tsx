import { useEffect, useRef } from "react";
import { Keyboard, X } from "lucide-react";
import { IconButton } from "./IconButton";

const shortcuts = [
  ["Next cue or slide", ["→", "Space", "Enter"]],
  ["Previous cue or slide", ["←"]],
  ["First slide", ["Home"]],
  ["Final slide", ["End"]],
  ["Toggle presentation mode", ["F"]],
  ["Leave presentation mode", ["Esc"]],
] as const;

export function ShortcutDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className="shortcut-dialog"
      aria-labelledby="shortcuts-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-heading">
        <div className="dialog-icon">
          <Keyboard size={23} />
        </div>
        <IconButton label="Close keyboard shortcuts" onClick={onClose}>
          <X size={20} />
        </IconButton>
      </div>
      <h2 id="shortcuts-title">Stay in your flow.</h2>
      <p>Everything you need, right at your fingertips.</p>
      <div className="shortcut-list">
        {shortcuts.map(([label, keys]) => (
          <div key={label}>
            <span>{label}</span>
            <span>
              {keys.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="dialog-tip">
        Animations pause at every cue. Take all the time you need.
      </div>
    </dialog>
  );
}
