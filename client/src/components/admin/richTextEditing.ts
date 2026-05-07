export type WrappedTextSelection = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export type AntdTextAreaLikeRef = {
  resizableTextArea?: {
    textArea?: HTMLTextAreaElement | null;
  } | null;
};

export function wrapTextSelection(value: string, start: number, end: number, wrapper: string): WrappedTextSelection | null {
  const selected = value.slice(start, end);
  if (!selected) return null;

  return {
    value: `${value.slice(0, start)}${wrapper}${selected}${wrapper}${value.slice(end)}`,
    selectionStart: start,
    selectionEnd: end + wrapper.length * 2
  };
}

export function getRichTextDraftValue(value: string, draftValue: string, focused: boolean) {
  return focused ? draftValue : value;
}

export function getNativeTextArea(ref: AntdTextAreaLikeRef | null): HTMLTextAreaElement | null {
  return ref?.resizableTextArea?.textArea || null;
}
