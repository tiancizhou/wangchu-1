import { strict as assert } from 'node:assert';
import { benefitRichTextLayout, benefitDetailTitles } from './benefitA4Layout';

assert.equal(benefitRichTextLayout.containerClassName, 'content-card container legal-content about-content');
assert.equal(benefitRichTextLayout.articleClassName, 'rich-text-placeholder legal-statement-document about-rich-text');
assert.equal(benefitRichTextLayout.bodyClassName, 'about-statement-section');
assert.equal(Object.keys(benefitDetailTitles).length, 6);
assert.equal(benefitDetailTitles['implementation-plan'], '共建实施方案');
