import { useState } from 'react';
import { uploadImage } from '../../api/adminApi';

type Props = {
  value?: string;
  onChange: (url: string) => void;
  multiple?: boolean;
  onMultipleChange?: (urls: string[]) => void;
};

export function ImageUploader({ value, onChange, multiple = false, onMultipleChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setError('');
    setLoading(true);
    try {
      if (multiple) {
        const results = await Promise.all(files.map((file) => uploadImage(file)));
        onMultipleChange?.(results.map((result) => result.url));
      } else {
        const result = await uploadImage(files[0]);
        onChange(result.url);
      }
      event.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : '图片上传失败');
      event.target.value = '';
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="image-uploader">
      {value ? <img src={value} alt="已上传" /> : <div className="upload-placeholder">暂无图片</div>}
      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onFileChange} disabled={loading} multiple={multiple} />
      {loading && <span>上传中...</span>}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
