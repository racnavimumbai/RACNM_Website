'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  Link as LinkIcon,
  Check,
  AlertCircle,
  CloudDownload,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { extractGoogleDriveFileId, formatImageUrl } from '@/lib/utils';

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
  const [uploadMessage, setUploadMessage] = useState('');
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const urlInput = customUrlInput !== null ? customUrlInput : (value || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError('File is too large. Max allowed size is 15MB.');
      return;
    }

    setUploading(true);
    setUploadMessage('Committing to GitHub repository...');
    setError('');
    setSuccessMsg('');
    setImgError(false);

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

      const finalUrl = data.url || data.dataUrl;
      onChange(finalUrl);
      setLocalPreviewUrl(finalUrl);
      setCustomUrlInput(finalUrl);
      setSuccessMsg(
        data.githubCommitted
          ? 'Successfully committed to GitHub repository!'
          : 'Uploaded to local uploads directory.'
      );
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadMessage('');
    }
  };

  const handleImportUrl = async (urlToImport?: string) => {
    const targetUrl = (urlToImport || urlInput || '').trim();
    if (!targetUrl) {
      setError('Please paste a valid image URL or Google Drive link first.');
      return;
    }

    const isDrive = Boolean(extractGoogleDriveFileId(targetUrl));
    setUploading(true);
    setUploadMessage(
      isDrive
        ? 'Downloading from Google Drive & saving to GitHub repo...'
        : 'Downloading image & saving to GitHub repo...'
    );
    setError('');
    setSuccessMsg('');
    setImgError(false);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to download and save image.');
      }

      const finalUrl = data.url || data.dataUrl;
      onChange(finalUrl);
      setLocalPreviewUrl(finalUrl);
      setCustomUrlInput(finalUrl);
      setSuccessMsg(
        data.githubCommitted
          ? 'Image downloaded & permanently committed to GitHub repository!'
          : 'Image saved to local repository uploads.'
      );
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to import image. Please check permissions.'
      );
    } finally {
      setUploading(false);
      setUploadMessage('');
    }
  };

  const isCurrentValueDrive = Boolean(extractGoogleDriveFileId(value));
  const isInputDrive = Boolean(extractGoogleDriveFileId(urlInput));
  const isHostedInRepo = Boolean(value && (value.includes('/uploads/') || value.includes('raw.githubusercontent.com')));

  // Use normalized display URL for preview
  const displayImage = formatImageUrl(localPreviewUrl || value);

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
            Upload File
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
            Drive Link / Web URL
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
                <span>{uploadMessage || 'Committing to GitHub repository...'}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <Upload className="w-5 h-5 text-zinc-400 group-hover:text-[#d4af37] transition-colors" />
                <span className="text-xs text-zinc-300 group-hover:text-white font-medium">
                  Click to select photo from computer / phone
                </span>
                <span className="text-[10px] text-zinc-500">
                  Automatically commits to GitHub repo under <code className="text-zinc-400">public/uploads</code> (up to 15MB)
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required={required && !value}
                value={urlInput}
                onChange={e => {
                  setCustomUrlInput(e.target.value);
                  setError('');
                  setSuccessMsg('');
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleImportUrl();
                  }
                }}
                placeholder="Paste Google Drive link or direct image URL..."
                className="w-full bg-[#08080b] border border-zinc-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#d4af37] pl-8"
              />
              <LinkIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            </div>

            <button
              type="button"
              disabled={uploading || !urlInput.trim()}
              onClick={() => handleImportUrl()}
              className="px-3 py-2 bg-[#d4af37] hover:bg-[#e6c258] disabled:opacity-50 text-black rounded text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              title="Download image and save to GitHub repository"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <CloudDownload className="w-3.5 h-3.5" />
                  <span>Download & Save to GitHub</span>
                </>
              )}
            </button>
          </div>

          {/* Google Drive Link Notification */}
          {isInputDrive && !isHostedInRepo && !uploading && (
            <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/60 text-blue-300 text-[11px] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-200">Google Drive Link Detected</p>
                <p className="text-blue-300/80 mt-0.5 leading-relaxed">
                  Drive links cannot be displayed directly on websites. Click{' '}
                  <strong className="text-white">“Download & Save to GitHub”</strong> to download and permanently host it in your GitHub repo.
                  Ensure the Drive link is shared as <em>&quot;Anyone with the link can view&quot;</em>.
                </p>
              </div>
            </div>
          )}

          {/* Legacy Google Drive Warning Banner for existing items */}
          {isCurrentValueDrive && !uploading && (
            <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[11px] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Current image uses a raw Google Drive link (may fail to load).</span>
              </div>
              <button
                type="button"
                onClick={() => handleImportUrl(value)}
                className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] rounded shrink-0 transition"
              >
                Migrate to GitHub Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 rounded bg-red-950/50 border border-red-900/60 text-red-400 text-[11px] flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className="p-2 rounded bg-emerald-950/50 border border-emerald-900/60 text-emerald-300 text-[11px] flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Image Preview Thumbnail */}
      {displayImage && (
        <div className="relative mt-2 h-36 rounded-xl overflow-hidden border border-zinc-800 group bg-black/60">
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={displayImage}
              alt="Preview"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-xs p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 text-zinc-600" />
              <span>Preview loading or link needs conversion...</span>
            </div>
          )}

          {/* Repo status badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {isHostedInRepo ? (
              <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1 shadow-md">
                <Check className="w-3 h-3" />
                <span>Saved in GitHub Repo</span>
              </span>
            ) : isCurrentValueDrive ? (
              <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-[10px] font-bold flex items-center gap-1 shadow-md">
                <AlertCircle className="w-3 h-3" />
                <span>Raw Drive Link</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-zinc-700 text-zinc-400 text-[10px] font-bold flex items-center gap-1 shadow-md">
                <ExternalLink className="w-3 h-3" />
                <span>External Link</span>
              </span>
            )}
          </div>

          {/* Quick action overlay */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] px-2 py-1 bg-black/70 backdrop-blur-md rounded border border-zinc-800 text-zinc-400">
            <span className="truncate max-w-[70%] font-mono">{displayImage}</span>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setLocalPreviewUrl('');
                setCustomUrlInput('');
                setError('');
                setSuccessMsg('');
              }}
              className="text-red-400 hover:text-red-300 font-semibold transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
