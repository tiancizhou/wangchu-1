import { useEffect, useState } from 'react';
import { adminNavigation, deleteNavigationItem, saveNavigationItem } from '../../api/adminApi';
import type { NavigationItem } from '../../api/publicApi';

const emptyItem: Partial<NavigationItem> = { label: '', url: '', sortOrder: 0, isVisible: true, openInNewTab: false };

export function NavigationAdminPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [editing, setEditing] = useState<Partial<NavigationItem>>(emptyItem);

  async function load() { setItems(await adminNavigation()); }
  useEffect(() => { load(); }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    await saveNavigationItem(editing);
    setEditing({ ...emptyItem });
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm('确定删除这个菜单吗？')) return;
    await deleteNavigationItem(id);
    await load();
  }

  return <section className="admin-panel"><h1>导航管理</h1><form className="admin-form" onSubmit={onSubmit}><label>菜单名称<input value={editing.label || ''} onChange={(e) => setEditing({ ...editing, label: e.target.value })} /></label><label>链接地址<input value={editing.url || ''} onChange={(e) => setEditing({ ...editing, url: e.target.value })} /></label><label>排序<input type="number" value={editing.sortOrder || 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} /></label><label className="checkbox"><input type="checkbox" checked={Boolean(editing.isVisible)} onChange={(e) => setEditing({ ...editing, isVisible: e.target.checked })} />显示</label><label className="checkbox"><input type="checkbox" checked={Boolean(editing.openInNewTab)} onChange={(e) => setEditing({ ...editing, openInNewTab: e.target.checked })} />新窗口打开</label><button>保存菜单</button></form><table className="admin-table"><thead><tr><th>名称</th><th>链接</th><th>排序</th><th>显示</th><th>操作</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.label}</td><td>{item.url}</td><td>{item.sortOrder}</td><td>{item.isVisible ? '显示' : '隐藏'}</td><td><button onClick={() => setEditing(item)}>编辑</button><button onClick={() => onDelete(item.id)}>删除</button></td></tr>)}</tbody></table></section>;
}
