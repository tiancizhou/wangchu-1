import { strict as assert } from 'node:assert';
import { getNativeTextArea, getRichTextDraftValue, wrapTextSelection } from './richTextEditing';

assert.deepEqual(
  wrapTextSelection('alpha beta gamma', 6, 10, '**'),
  { value: 'alpha **beta** gamma', selectionStart: 6, selectionEnd: 14 }
);

assert.deepEqual(
  wrapTextSelection('alpha beta gamma', 6, 6, '**'),
  null
);

assert.equal(
  getRichTextDraftValue('first paragraph', 'first paragraph\n', true),
  'first paragraph\n'
);

assert.equal(
  getRichTextDraftValue('first paragraph', 'first paragraph\n', false),
  'first paragraph'
);

const nativeTextArea = { selectionStart: 2, selectionEnd: 5 } as HTMLTextAreaElement;

assert.equal(
  getNativeTextArea({ resizableTextArea: { textArea: nativeTextArea } }),
  nativeTextArea
);

assert.equal(
  getNativeTextArea({ resizableTextArea: null }),
  null
);

assert.equal(
  getNativeTextArea(null),
  null
);
