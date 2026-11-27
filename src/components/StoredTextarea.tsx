import { useEffect, useState, type ReactNode } from 'react';

/**
 * Textarea bound to a persisted string. Typing is saved after a short pause
 * (and on blur); external changes (import / reset) replace the local text.
 */
export function StoredTextarea({
  value,
  onSave,
  label,
  placeholder,
  rows = 3,
}: {
  value: string;
  onSave: (v: string) => void;
  label: ReactNode;
  placeholder?: string;
  rows?: number;
}) {
  const [text, setText] = useState(value);
  const [synced, setSynced] = useState(value);
  if (value !== synced) {
    setSynced(value);
    setText(value);
  }

  useEffect(() => {
    if (text === value) return;
    const t = window.setTimeout(() => onSave(text), 400);
    return () => window.clearTimeout(t);
  }, [text, value, onSave]);

  return (
    <label className="note-field">
      <span className="kicker">{label}</span>
      <textarea
        rows={rows}
        value={text}
        maxLength={20000}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => text !== value && onSave(text)}
      />
    </label>
  );
}
