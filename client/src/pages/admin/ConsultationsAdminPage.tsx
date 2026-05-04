import { useEffect, useState } from 'react';
import { adminConsultations, updateConsultation, type ConsultationSubmission } from '../../api/adminApi';

export function ConsultationsAdminPage() {
  const [items, setItems] = useState<ConsultationSubmission[]>([]);
  const [editing, setEditing] = useState<ConsultationSubmission | null>(null);

  async function load() { setItems(await adminConsultations()); }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    await updateConsultation(editing.id, { status: editing.status, adminNote: editing.adminNote });
    setEditing(null);
    await load();
  }

  return <section className="admin-panel"><h1>咨询记录</h1>{editing && <div className="admin-form"><h2>处理记录</h2><p>{editing.name}　{editing.phone}</p><label>状态<select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}><option value="new">新提交</option><option value="contacted">已联系</option><option value="closed">已关闭</option></select></label><label>备注<textarea value={editing.adminNote} onChange={(e) => setEditing({ ...editing, adminNote: e.target.value })} /></label><button onClick={save}>保存处理结果</button></div>}<table className="admin-table"><thead><tr><th>姓名</th><th>电话</th><th>行业</th><th>说明</th><th>状态</th><th>时间</th><th>操作</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.phone}</td><td>{item.industry}</td><td>{item.message}</td><td>{item.status}</td><td>{new Date(item.createdAt).toLocaleString()}</td><td><button onClick={() => setEditing(item)}>处理</button></td></tr>)}</tbody></table></section>;
}
