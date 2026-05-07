import { useState } from 'react';
import { Upload, App, Progress, Button, Image } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadImage } from '../../api/adminApi';
import { ImageCropModal } from './ImageCropModal';
import { type CropPresetKey, type CropSize, formatCropSize, resolveCropSize } from './imageCropPresets';

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
  cropPreset?: CropPresetKey;
  cropSize?: CropSize;
  disableCrop?: boolean;
  previewMaxHeight?: number;
  previewWidth?: number;
};

export function Dropzone({ value, onChange, multiple = false, onMultipleChange, accept = DEFAULT_ACCEPT, maxSize = DEFAULT_MAX_SIZE, hint, cropPreset, cropSize, disableCrop = false, previewMaxHeight = 180, previewWidth }: Props) {
  const { message } = App.useApp();
  const [progress, setProgress] = useState<number | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const targetCropSize = disableCrop ? undefined : resolveCropSize(cropPreset, cropSize);

  async function uploadPreparedFile(file: File) {
    try {
      setProgress(10);
      const result = await uploadImage(file);
      setProgress(100);
      if (multiple) {
        onMultipleChange?.([result.url]);
      } else {
        onChange(result.url);
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : '图片上传失败');
    } finally {
      setTimeout(() => setProgress(null), 600);
    }
  }

  function validateFile(file: File) {
    if (file.size > maxSize) {
      message.error(`文件过大：${file.name}，请控制在 ${Math.round(maxSize / 1024 / 1024)}MB 以内`);
      return false;
    }
    if (targetCropSize && file.type === 'image/gif') {
      message.error('动图无法保持动画裁剪，请上传 JPG/PNG/WebP。');
      return false;
    }
    return true;
  }

  const beforeUpload: UploadProps['beforeUpload'] = (file, fileList) => {
    if (!validateFile(file as File)) return Upload.LIST_IGNORE;
    if (!targetCropSize) return true;
    if (file.uid !== fileList[0]?.uid) return Upload.LIST_IGNORE;
    const validFiles = (fileList as File[]).filter(validateFile);
    setPendingFiles(validFiles.slice(1));
    setCropFile(validFiles[0] || null);
    return Upload.LIST_IGNORE;
  };

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const file = options.file as File;
    try {
      await uploadPreparedFile(file);
      options.onSuccess?.({}, new XMLHttpRequest());
    } catch (err) {
      options.onError?.(err as Error);
    }
  };

  async function confirmCrop(file: File) {
    await uploadPreparedFile(file);
    const [nextFile, ...remainingFiles] = pendingFiles;
    setPendingFiles(remainingFiles);
    setCropFile(nextFile || null);
  }

  const defaultHint = targetCropSize
    ? `支持 JPG/PNG/WebP，上传前需裁剪为 ${formatCropSize(targetCropSize)}，单张 ≤ ${Math.round(maxSize / 1024 / 1024)}MB`
    : `支持 JPG/PNG/WebP/GIF，单张 ≤ ${Math.round(maxSize / 1024 / 1024)}MB`;

  return (
    <div style={{ width: '100%' }}>
      {value && !multiple ? (
        <div style={{ position: 'relative', display: 'inline-block', borderRadius: 10, overflow: 'hidden', border: '1px solid #eef2f8' }}>
          <Image src={value} alt="已上传" style={{ maxHeight: previewMaxHeight, width: previewWidth, objectFit: 'contain' }} />
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
          <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>{hint || defaultHint}</p>
          {progress !== null && <Progress percent={progress} size="small" style={{ marginTop: 8 }} />}
        </Upload.Dragger>
      )}
      {targetCropSize && <ImageCropModal file={cropFile} cropSize={targetCropSize} open={Boolean(cropFile)} onCancel={() => { setCropFile(null); setPendingFiles([]); }} onConfirm={confirmCrop} />}
    </div>
  );
}
