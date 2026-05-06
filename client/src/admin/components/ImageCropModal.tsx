import { useEffect, useMemo, useState } from 'react';
import { Modal, Slider, Typography } from 'antd';
import Cropper, { type Area } from 'react-easy-crop';
import { type CropSize, formatCropSize } from './imageCropPresets';

type Props = {
  file: File | null;
  cropSize: CropSize;
  open: boolean;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void> | void;
};

function getOutputMimeType(file: File) {
  if (file.type === 'image/png') return 'image/png';
  if (file.type === 'image/webp') return 'image/webp';
  return 'image/jpeg';
}

function getOutputFileName(file: File, cropSize: CropSize, mimeType: string) {
  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return `${baseName}-${cropSize.width}x${cropSize.height}.${extension}`;
}

async function cropImage(file: File, cropArea: Area, cropSize: CropSize) {
  const imageUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = imageUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('图片读取失败'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = cropSize.width;
    canvas.height = cropSize.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('浏览器不支持图片裁剪');

    context.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, cropSize.width, cropSize.height);
    const mimeType = getOutputMimeType(file);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error('图片裁剪失败')), mimeType, 0.92);
    });

    return new File([blob], getOutputFileName(file, cropSize, mimeType), { type: mimeType });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export function ImageCropModal({ file, cropSize, open, onCancel, onConfirm }: Props) {
  const imageUrl = useMemo(() => file ? URL.createObjectURL(file) : '', [file]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (!open) return;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setSaving(false);
  }, [open, file]);

  async function confirmCrop() {
    if (!file || !croppedAreaPixels) return;
    setSaving(true);
    try {
      await onConfirm(await cropImage(file, croppedAreaPixels, cropSize));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`裁剪${cropSize.label}`} open={open} onCancel={onCancel} onOk={confirmCrop} okText="确认裁剪并上传" cancelText="取消" confirmLoading={saving} width={760} destroyOnClose>
      <Typography.Paragraph type="secondary">输出尺寸：{formatCropSize(cropSize)}。请拖动图片并调整缩放，确认后会按该尺寸上传。</Typography.Paragraph>
      <div style={{ position: 'relative', height: 420, background: '#111', borderRadius: 10, overflow: 'hidden' }}>
        {imageUrl && (
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={cropSize.width / cropSize.height}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        )}
      </div>
      <div style={{ marginTop: 18 }}>
        <Typography.Text type="secondary">缩放</Typography.Text>
        <Slider min={1} max={3} step={0.01} value={zoom} onChange={setZoom} />
      </div>
    </Modal>
  );
}
