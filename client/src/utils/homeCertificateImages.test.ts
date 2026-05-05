import { strict as assert } from 'node:assert';
import { normalizeHomeCertificateImages } from './homeCertificateImages';

const normalized = normalizeHomeCertificateImages([
  { id: 'second-home-certificate', imageUrl: '/second-home-horizontal.jpg', title: '首页荣誉二', sortOrder: 2, isPublished: true },
  { id: 'home-certificate', imageUrl: '/home-horizontal.jpg', title: '首页荣誉一', sortOrder: 1, isPublished: true },
  { id: 'hidden-home-certificate', imageUrl: '/hidden-horizontal.jpg', title: '隐藏荣誉', sortOrder: 3, isPublished: false },
  { id: 'empty-image', imageUrl: '', title: '空图', sortOrder: 4, isPublished: true }
]);

assert.deepEqual(normalized, [
  { id: 'home-certificate', imageUrl: '/home-horizontal.jpg', title: '首页荣誉一', sortOrder: 1, isPublished: true },
  { id: 'second-home-certificate', imageUrl: '/second-home-horizontal.jpg', title: '首页荣誉二', sortOrder: 2, isPublished: true },
  { id: 'hidden-home-certificate', imageUrl: '/hidden-horizontal.jpg', title: '隐藏荣誉', sortOrder: 3, isPublished: false }
]);
