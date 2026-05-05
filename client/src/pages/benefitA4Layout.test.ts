import { strict as assert } from 'node:assert';
import { benefitA4Layout, benefitDetailTitles } from './benefitA4Layout';

assert.deepEqual(benefitA4Layout.pageSize, { width: '210mm', minHeight: '297mm' });
assert.deepEqual(benefitA4Layout.padding, { top: '37mm', right: '26mm', bottom: '35mm', left: '28mm' });
assert.equal(benefitA4Layout.body.textIndent, '2em');
assert.equal(benefitA4Layout.body.textAlign, 'justify');
assert.equal(benefitA4Layout.body.lineCount, 22);
assert.equal(benefitA4Layout.body.charactersPerLine, 28);
assert.equal(Object.keys(benefitDetailTitles).length, 6);
assert.equal(benefitDetailTitles['implementation-plan'], '共建实施方案');
