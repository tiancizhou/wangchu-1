import { useState } from 'react';
import { uploadMedia } from '../../api/adminApi';

const videoPattern = /\.(mp4|webm|mov)$/i;

function isVideo(url?: string) {
  return Boolean(url && videoPattern.test(url));
}

type Props = {
  value?: string;
  onChange: (url: string) => void;
  multiple?: boolean;
  onMultipleChange?: (urls: string[]) => void;
};

export function MediaUploader({ value, onChange, multiple = false, onMultipleChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setError('');
    setLoading(true);
    try {
      if (multiple) {
        const results = await Promise.all(files.map((file) => uploadMedia(file)));
        onMultipleChange?.(results.map((result) => result.url));
      } else {
        const result = await uploadMedia(files[0]);
        onChange(result.url);
      }
      event.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : '媒体文件上传失败');
      event.target.value = '';
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="image-uploader media-uploader">
      {value ? isVideo(value) ? <video src={value} controls muted playsInline /> : <img src={value} alt="已上传" /> : <div className="upload-placeholder">暂无媒体</div>}
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime" onChange={onFileChange} disabled={loading} multiple={multiple} />
      {loading && <span>上传中...</span>}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
