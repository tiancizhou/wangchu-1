import { useState } from 'react';
import { Upload, App, Progress, Button } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadMedia } from '../../api/adminApi';
import { ImageCropModal } from './ImageCropModal';
import { type CropPresetKey, type CropSize, formatCropSize, resolveCropSize } from './imageCropPresets';

const DEFAULT_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime';
const DEFAULT_MAX_SIZE = 80 * 1024 * 1024;
const VIDEO_PATTERN = /\.(mp4|webm|mov)$/i;

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
  disableImageCrop?: boolean;
  maxVideoDurationSeconds?: number;
};

function isVideoFile(file: File) {
  return file.type.startsWith('video/') || VIDEO_PATTERN.test(file.name);
}

function readVideoDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('无法读取视频时长'));
    };
    video.src = url;
  });
}

export function MediaDropzone({ value, onChange, multiple = false, onMultipleChange, accept = DEFAULT_ACCEPT, maxSize = DEFAULT_MAX_SIZE, hint, cropPreset, cropSize, disableImageCrop = false, maxVideoDurationSeconds }: Props) {
  const { message } = App.useApp();
  const [progress, setProgress] = useState<number | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const targetCropSize = disableImageCrop ? undefined : resolveCropSize(cropPreset, cropSize);

  async function uploadPreparedFile(file: File) {
    try {
      setProgress(10);
      const result = await uploadMedia(file);
      setProgress(100);
      if (multiple) {
        onMultipleChange?.([result.url]);
      } else {
        onChange(result.url);
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : '媒体上传失败');
    } finally {
      setTimeout(() => setProgress(null), 600);
    }
  }

  function validateFile(file: File) {
    if (file.size > maxSize) {
      message.error(`文件过大：${file.name}，请控制在 ${Math.round(maxSize / 1024 / 1024)}MB 以内`);
      return false;
    }
    return true;
  }

  async function handleFile(file: File) {
    if (maxVideoDurationSeconds && isVideoFile(file)) {
      const duration = await readVideoDuration(file);
      if (duration > maxVideoDurationSeconds) {
        message.error(`视频时长不能超过 ${maxVideoDurationSeconds} 秒：${file.name}`);
        return;
      }
    }
    if (targetCropSize && file.type.startsWith('image/') && file.type !== 'image/gif') {
      setCropFile(file);
      return;
    }
    if (targetCropSize && (file.type === 'image/gif' || isVideoFile(file))) {
      message.warning(`${file.type === 'image/gif' ? 'GIF 动图' : '视频'}不会自动裁剪，请提前制作为 ${formatCropSize(targetCropSize)} 或相同比例。`);
    }
    await uploadPreparedFile(file);
  }

  const beforeUpload: UploadProps['beforeUpload'] = (file, fileList) => {
    if (!validateFile(file as File)) return Upload.LIST_IGNORE;
    if (!targetCropSize || !file.type.startsWith('image/') || file.type === 'image/gif') return true;
    if (file.uid !== fileList[0]?.uid) return Upload.LIST_IGNORE;
    const validFiles = (fileList as File[]).filter(validateFile);
    setPendingFiles(validFiles.slice(1));
    handleFile(validFiles[0]);
    return Upload.LIST_IGNORE;
  };

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const file = options.file as File;
    try {
      await handleFile(file);
      options.onSuccess?.({}, new XMLHttpRequest());
    } catch (err) {
      options.onError?.(err as Error);
    }
  };

  async function confirmCrop(file: File) {
    await uploadPreparedFile(file);
    setCropFile(null);
    const [nextFile, ...remainingFiles] = pendingFiles;
    setPendingFiles(remainingFiles);
    if (nextFile) await handleFile(nextFile);
  }

  const videoDurationHint = maxVideoDurationSeconds ? `，视频时长 ≤ ${maxVideoDurationSeconds} 秒` : '';
  const defaultHint = targetCropSize
    ? `图片上传前裁剪为 ${formatCropSize(targetCropSize)}；视频/GIF 请提前制作成对应比例，单个 ≤ ${Math.round(maxSize / 1024 / 1024)}MB${videoDurationHint}`
    : `支持图片与 MP4/WebM/MOV 视频，单个 ≤ ${Math.round(maxSize / 1024 / 1024)}MB${videoDurationHint}`;

  if (value && !multiple) {
    const isVideo = VIDEO_PATTERN.test(value);
    return (
      <div style={{ position: 'relative', display: 'inline-block', borderRadius: 10, overflow: 'hidden', border: '1px solid #eef2f8' }}>
        {isVideo ? <video src={value} controls muted playsInline style={{ maxHeight: 200 }} /> : <img src={value} alt="已上传" style={{ maxHeight: 200, objectFit: 'contain' }} />}
        <div style={{ position: 'absolute', right: 8, top: 8, display: 'flex', gap: 8 }}>
          <Upload beforeUpload={beforeUpload} customRequest={customRequest} accept={accept} showUploadList={false} multiple={false}>
            <Button size="small">替换</Button>
          </Upload>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onChange('')}>移除</Button>
        </div>
        {targetCropSize && <ImageCropModal file={cropFile} cropSize={targetCropSize} open={Boolean(cropFile)} onCancel={() => { setCropFile(null); setPendingFiles([]); }} onConfirm={confirmCrop} />}
      </div>
    );
  }

  return (
    <>
      <Upload.Dragger name="file" multiple={multiple} accept={accept} showUploadList={false} beforeUpload={beforeUpload} customRequest={customRequest} style={{ padding: 16 }}>
        <p style={{ fontSize: 32, color: '#94a3b8', margin: 0 }}><InboxOutlined /></p>
        <p style={{ margin: '8px 0 4px', fontSize: 14 }}>拖拽上传或点击选择文件</p>
        <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>{hint || defaultHint}</p>
        {progress !== null && <Progress percent={progress} size="small" style={{ marginTop: 8 }} />}
      </Upload.Dragger>
      {targetCropSize && <ImageCropModal file={cropFile} cropSize={targetCropSize} open={Boolean(cropFile)} onCancel={() => { setCropFile(null); setPendingFiles([]); }} onConfirm={confirmCrop} />}
    </>
  );
}
