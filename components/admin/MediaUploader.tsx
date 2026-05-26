'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

type MediaUploaderProps = {
  folder?: string;
  onUploaded?: (media: Record<string, unknown>) => void;
  accept?: string;
};

export default function MediaUploader({
  folder = 'mzinyathi',
  onUploaded,
  accept = 'image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx',
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      toast.success('File uploaded');
      onUploaded?.(data.media);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 bg-[#4169E1] text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        Upload Image / PDF / Video / File
      </button>
    </div>
  );
}
