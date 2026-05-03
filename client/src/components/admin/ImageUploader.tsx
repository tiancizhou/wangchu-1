import { useState } from 'react';
import { uploadImage } from '../../api/adminApi';

type Props = {
  value?: string;
  onChange: (url: string) => void;
};

export function ImageUploader({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const result = await uploadImage(file);
      onChange(result.url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="image-uploader">
      {value ? <img src={value} alt="已上传" /> : <div className="upload-placeholder">暂无图片</div>}
      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onFileChange} />
      {loading && <span>上传中...</span>}
    </div>
  );
}
