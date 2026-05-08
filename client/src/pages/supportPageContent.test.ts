import { strict as assert } from 'node:assert';
import { getSupportPageContent, serviceStations, supportCenters, technicalColumns } from './supportPageContent';

assert.deepEqual(supportCenters.map((center) => center.title), ['研发中心', '质量中心']);
assert.equal(technicalColumns.length, 6);
assert.deepEqual(technicalColumns.map((column) => column.title), ['辅料化验', '结构解析', '调和工艺', '标准制定', '产品封装', '三方原则']);
assert.equal(serviceStations.length, 7);
assert.deepEqual(serviceStations.map((station) => station.station), ['华北服务站', '东北服务站', '华东服务站', '华中服务站', '华南服务站', '西南服务站', '西北服务站']);

for (const center of supportCenters) {
  assert.ok(center.description.length >= 50 && center.description.length <= 200, `${center.title} description should be 50-200 chars`);
}

for (const column of technicalColumns) {
  assert.ok(column.description.length >= 50 && column.description.length <= 100, `${column.title} description should be 50-100 chars`);
}

for (const station of serviceStations) {
  assert.ok(station.contact, `${station.station} should include contact`);
  assert.ok(station.phone, `${station.station} should include phone`);
  assert.ok(station.address, `${station.station} should include address`);
  assert.ok(station.areas, `${station.station} should include areas`);
}

const merged = getSupportPageContent({
  heroImageUrl: '/uploads/support.jpg',
  centers: [{ title: '新研发中心', description: '研发中心后台编辑后的完整说明文字，长度保持在要求范围内，用于验证前台读取后台数据。' }],
  technicalColumns: [{ title: '新栏目', description: '后台编辑后的栏目说明文字，长度保持在五十到一百字之间，验证合并逻辑优先使用已保存数据。' }],
  serviceStations: [{ station: '新服务站', contact: '李明', phone: '010-88888888', address: '北京市测试地址', areas: '北京' }]
});

assert.equal(merged.heroImageUrl, '/uploads/support.jpg');
assert.equal(merged.centers[0].title, '新研发中心');
assert.equal(merged.centers[1].title, '质量中心');
assert.equal(merged.technicalColumns[0].title, '新栏目');
assert.equal(merged.technicalColumns.length, 6);
assert.equal(merged.serviceStations[0].station, '新服务站');
assert.equal(merged.serviceStations.length, 7);
