'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Check, Loader2, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
  required = false
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image.');
      }

      onChange(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-zinc-400 block text-xs font-semibold">
          {label} {required && '*'}
        </label>
        <div className="flex items-center gap-2 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              mode === 'upload'
                ? 'bg-[#d4af37] text-black'
                : 'text-zinc-400 hover:text-white bg-zinc-800'
            }`}
          >
            Upload File (GitHub Repo)
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              mode === 'url'
                ? 'bg-[#d4af37] text-black'
                : 'text-zinc-400 hover:text-white bg-zinc-800'
            }`}
          >
            Paste Direct URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-800 hover:border-[#d4af37]/60 rounded-xl p-4 text-center cursor-pointer bg-[#08080b] hover:bg-zinc-900/50 transition-all group"
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-xs text-[#d4af37] font-semibold py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to GitHub repository...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <Upload className="w-5 h-5 text-zinc-400 group-hover:text-[#d4af37] transition-colors" />
                <span className="text-xs text-zinc-300 group-hover:text-white font-medium">
                  Click to select photo from phone / computer
                </span>
                <span className="text-[10px] text-zinc-500">
                  Commits directly to repository at <code className="text-[#d4af37]">public/uploads/</code>
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="url"
            required={required}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full bg-[#08080b] border border-zinc-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] pl-8"
          />
          <LinkIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-3" />
        </div>
      )}

      {error && (
        <p className="text-red-400 text-[11px] mt-1">{error}</p>
      )}

      {/* Image Preview Thumbnail */}
      {value && (
        <div className="relative mt-2 h-28 rounded-xl overflow-hidden border border-zinc-800 group bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold flex items-center gap-1">
            <Check className="w-3 h-3 text-[#d4af37]" />
            <span>Image Attached</span>
          </div>
        </div>
      )}
    </div>
  );
}
