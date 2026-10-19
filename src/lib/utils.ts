import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export function formatShortDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export async function deleteUploadedImage(imageUrl: string | undefined | null) {
  if (!imageUrl || !imageUrl.includes('/uploads/')) return;
  try {
    await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl })
    });
  } catch (err) {
    console.error('Failed to delete image:', err);
  }
}

/**
 * Extracts the file ID from various Google Drive link formats.
 */
export function extractGoogleDriveFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Don't treat folder links as single files
  if (trimmed.includes('/folders/')) return null;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/,
    /\/uc\?.*id=([a-zA-Z0-9_-]+)/,
    /\/thumbnail\?.*id=([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Normalizes an image URL for display in <img> tags.
 * If a raw Google Drive link is passed (e.g. legacy data),
 * it converts it to Google's high-res thumbnail CDN so it doesn't fail in the browser.
 */
export function formatImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    const driveId = extractGoogleDriveFileId(trimmed);
    if (driveId) {
      return `https://lh3.googleusercontent.com/d/${driveId}`;
    }
  }
  return trimmed;
}

