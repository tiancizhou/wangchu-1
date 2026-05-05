import { useEffect, useState } from 'react';
import { App, Button, Drawer, Form, Input, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminConsultations, updateConsultation, type ConsultationSubmission } from '../../api/adminApi';
import { PageHeader, SearchableTable } from '../../admin/components';

const statusLabels: Record<string, string> = {
  new: '新提交',
  contacted: '已联系',
  closed: '已关闭'
};

const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }));

export function ConsultationsAdminPage() {
  const [items, setItems] = useState<ConsultationSubmission[]>([]);
  const [editing, setEditing] = useState<ConsultationSubmission | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<Pick<ConsultationSubmission, 'status' | 'adminNote'>>();
  const { message } = App.useApp();

  async function load() { setItems(await adminConsultations()); }

  useEffect(() => { load().catch((err) => message.error(err instanceof Error ? err.message : '咨询记录加载失败')); }, [message]);
  useEffect(() => { if (editing) form.setFieldsValue({ status: editing.status, adminNote: editing.adminNote }); }, [editing, form]);

  async function save(values: Pick<ConsultationSubmission, 'status' | 'adminNote'>) {
    if (!editing) return;
    setSaving(true);
    try {
      await updateConsultation(editing.id, { status: values.status, adminNote: values.adminNote });
      message.success('处理记录已保存');
      setEditing(null);
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '处理记录保存失败');
    } finally {
      setSaving(false);
    }
  }

  const columns: ColumnsType<ConsultationSubmission> = [
    { title: '姓名', dataIndex: 'name' },
    { title: '电话', dataIndex: 'phone' },
    { title: '行业', dataIndex: 'industry' },
    { title: '说明', dataIndex: 'message', ellipsis: true },
    { title: '状态', dataIndex: 'status', filters: statusOptions.map(({ value, label }) => ({ value, text: label })), onFilter: (value, record) => record.status === value, render: (status: string) => <Tag color={status === 'new' ? 'processing' : status === 'contacted' ? 'success' : 'default'}>{statusLabels[status] || status}</Tag> },
    { title: '时间', dataIndex: 'createdAt', sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(), render: (value: string) => new Date(value).toLocaleString() },
    { title: '操作', render: (_, item) => <Button size="small" onClick={() => setEditing(item)}>处理</Button> }
  ];

  return (
    <div>
      <PageHeader title="咨询记录" description="查看客户提交的合作咨询，并记录跟进状态。" />
      <SearchableTable columns={columns} data={items} rowKey="id" searchableKeys={['name', 'phone', 'industry', 'message']} searchPlaceholder="搜索姓名、电话、行业或说明" />
      <Drawer title="处理咨询记录" open={Boolean(editing)} onClose={() => setEditing(null)} width={420}>
        {editing && <p>{editing.name}　{editing.phone}</p>}
        <Form form={form} layout="vertical" onFinish={save}>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}><Select options={statusOptions} /></Form.Item>
          <Form.Item name="adminNote" label="备注"><Input.TextArea rows={5} /></Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>保存处理结果</Button>
        </Form>
      </Drawer>
    </div>
  );
}
