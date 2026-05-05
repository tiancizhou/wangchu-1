import { useState } from 'react';
import { Upload, App, Progress, Button, Image } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadImage } from '../../api/adminApi';

const DEFAULT_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif';
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

type Props = {
  value?: string;
  onChange: (url: string) => void;
  multiple?: boolean;
  onMultipleChange?: (urls: string[]) => void;
  accept?: string;
  maxSize?: number;
  hint?: string;
};

export function Dropzone({ value, onChange, multiple = false, onMultipleChange, accept = DEFAULT_ACCEPT, maxSize = DEFAULT_MAX_SIZE, hint }: Props) {
  const { message } = App.useApp();
  const [progress, setProgress] = useState<number | null>(null);

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (file.size > maxSize) {
      message.error(`文件过大：${file.name}，请控制在 ${Math.round(maxSize / 1024 / 1024)}MB 以内`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const file = options.file as File;
    try {
      setProgress(10);
      const result = await uploadImage(file);
      setProgress(100);
      options.onSuccess?.(result, new XMLHttpRequest());
      if (multiple) {
        onMultipleChange?.([result.url]);
      } else {
        onChange(result.url);
      }
    } catch (err) {
      options.onError?.(err as Error);
      message.error(err instanceof Error ? err.message : '图片上传失败');
    } finally {
      setTimeout(() => setProgress(null), 600);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {value && !multiple ? (
        <div style={{ position: 'relative', display: 'inline-block', borderRadius: 10, overflow: 'hidden', border: '1px solid #eef2f8' }}>
          <Image src={value} alt="已上传" style={{ maxHeight: 180, objectFit: 'contain' }} />
          <div style={{ position: 'absolute', right: 8, top: 8, display: 'flex', gap: 8 }}>
            <Upload beforeUpload={beforeUpload} customRequest={customRequest} accept={accept} showUploadList={false} multiple={false}>
              <Button size="small">替换</Button>
            </Upload>
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onChange('')}>移除</Button>
          </div>
        </div>
      ) : (
        <Upload.Dragger name="file" multiple={multiple} accept={accept} showUploadList={false} beforeUpload={beforeUpload} customRequest={customRequest} style={{ padding: 16 }}>
          <p style={{ fontSize: 32, color: '#94a3b8', margin: 0 }}><InboxOutlined /></p>
          <p style={{ margin: '8px 0 4px', fontSize: 14 }}>拖拽上传或点击选择文件</p>
          <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>{hint || `支持 JPG/PNG/WebP/GIF，单张 ≤ ${Math.round(maxSize / 1024 / 1024)}MB`}</p>
          {progress !== null && <Progress percent={progress} size="small" style={{ marginTop: 8 }} />}
        </Upload.Dragger>
      )}
    </div>
  );
}
