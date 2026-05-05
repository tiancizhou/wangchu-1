import { strict as assert } from 'node:assert';
import { legalStatementContent } from './legalStatementContent';

assert.equal(legalStatementContent.title, '法律声明');
assert.deepEqual(legalStatementContent.sections.map((section) => section.heading), [
  '我们的责任',
  '本网站的版权和商标所有权',
  '链接使用',
  '本网站所适用的法律',
  '版权所有 翻版必究'
]);
assert.ok(legalStatementContent.sections[0].paragraphs[0].includes('juerrun@163.com'));
assert.ok(legalStatementContent.sections[1].paragraphs[1].includes('kronprinsK'));
assert.ok(legalStatementContent.sections[3].paragraphs[0].includes('中国法律'));
