import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminSession } from '@/lib/auth/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { extractGoogleDriveFileId } from '@/lib/utils';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 Megabytes
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/heic',
  'image/heif'
]);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.heic', '.heif']);

/**
 * Sniffs binary buffer headers to detect image MIME type and file extension.
 */
function detectImageMime(buffer: Buffer): { mime: string; ext: string } | null {
  if (!buffer || buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: 'image/jpeg', ext: '.jpg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { mime: 'image/png', ext: '.png' };
  }

  // GIF: 47 49 46 38
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return { mime: 'image/gif', ext: '.gif' };
  }

  // WEBP: 'RIFF'....'WEBP'
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: 'image/webp', ext: '.webp' };
  }

  // SVG: starts with '<svg' or '<?xml'
  const startStr = buffer.subarray(0, 100).toString('utf8').trim().toLowerCase();
  if (startStr.startsWith('<svg') || startStr.startsWith('<?xml')) {
    return { mime: 'image/svg+xml', ext: '.svg' };
  }

  return null;
}

/**
 * Downloads a Google Drive image using prioritized endpoints and handles redirects/confirmations.
 */
async function downloadGoogleDriveFile(fileId: string): Promise<{ buffer: Buffer; mimeType?: string; error?: string }> {
  const candidateUrls = [
    `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0&confirm=t`,
    `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`,
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=s0`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2560`
  ];

  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
  };

  let lastHtmlSnippet = '';

  for (const candidate of candidateUrls) {
    try {
      const res = await fetch(candidate, {
        headers: browserHeaders,
        redirect: 'follow'
      });

      if (!res.ok && res.status !== 302 && res.status !== 303) {
        continue;
      }

      const contentType = res.headers.get('content-type') || '';
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Check if buffer is valid image data
      const detected = detectImageMime(buffer);
      if (detected || contentType.startsWith('image/')) {
        return {
          buffer,
          mimeType: detected?.mime || contentType.split(';')[0].trim()
        };
      }

      // If it returned HTML, inspect for confirmation links (large file / virus warning)
      if (contentType.includes('text/html')) {
        const html = buffer.subarray(0, 5000).toString('utf-8');
        lastHtmlSnippet = html;

        const confirmMatch = html.match(/confirm=([0-9a-zA-Z_-]+)/) ||
                             html.match(/href="(\/uc\?export=download[^"]+)"/);

        if (confirmMatch) {
          let confirmUrl = '';
          if (confirmMatch[0].startsWith('confirm=')) {
            confirmUrl = `https://drive.google.com/uc?export=download&id=${fileId}&${confirmMatch[0]}`;
          } else if (confirmMatch[1]) {
            confirmUrl = `https://drive.google.com${confirmMatch[1].replace(/&amp;/g, '&')}`;
          }

          if (confirmUrl) {
            const confirmedRes = await fetch(confirmUrl, {
              headers: browserHeaders,
              redirect: 'follow'
            });
            if (confirmedRes.ok) {
              const confBuf = Buffer.from(await confirmedRes.arrayBuffer());
              const confDetect = detectImageMime(confBuf);
              if (confDetect || (confirmedRes.headers.get('content-type') || '').startsWith('image/')) {
                return {
                  buffer: confBuf,
                  mimeType: confDetect?.mime || confirmedRes.headers.get('content-type')?.split(';')[0].trim()
                };
              }
            }
          }
        }
      }
    } catch (fetchErr) {
      console.warn(`[Drive Download Candidate failed: ${candidate}]`, fetchErr);
    }
  }

  // Check if failure is due to privacy/permissions
  if (
    lastHtmlSnippet.includes('accounts.google.com') ||
    lastHtmlSnippet.includes('ServiceLogin') ||
    lastHtmlSnippet.includes('permission') ||
    lastHtmlSnippet.includes('Access denied') ||
    lastHtmlSnippet.includes('not have permission')
  ) {
    return {
      buffer: Buffer.alloc(0),
      error: 'Google Drive file is private or restricted. Please open the file in Google Drive, click "Share", and change General Access to "Anyone with the link can view".'
    };
  }

  return {
    buffer: Buffer.alloc(0),
    error: 'Could not download image from Google Drive. Please ensure the link is a valid image and General Access is set to "Anyone with the link can view".'
  };
}

/**
 * Downloads an image from a standard external URL.
 */
async function downloadExternalFile(url: string): Promise<{ buffer: Buffer; mimeType?: string; error?: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      redirect: 'follow'
    });

    if (!res.ok) {
      return { buffer: Buffer.alloc(0), error: `Failed to download image (HTTP ${res.status}).` };
    }

    const contentType = res.headers.get('content-type') || '';
    const buffer = Buffer.from(await res.arrayBuffer());
    const detected = detectImageMime(buffer);

    if (!detected && !contentType.startsWith('image/')) {
      return { buffer: Buffer.alloc(0), error: 'The provided URL did not return a supported image format.' };
    }

    return {
      buffer,
      mimeType: detected?.mime || contentType.split(';')[0].trim()
    };
  } catch (err: unknown) {
    return { buffer: Buffer.alloc(0), error: err instanceof Error ? err.message : 'Failed to download image from URL.' };
  }
}

export async function POST(request: Request) {
  try {
    // 1. Enforce admin authentication
    const isAuthorized = await verifyAdminSession(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required.' },
        { status: 401 }
      );
    }

    // 2. Upload Rate Limiting (Allows up to 50 photo uploads/imports per 10 minutes)
    const clientIp = getClientIp(request);
    const rl = rateLimit(`upload_${clientIp}`, 50, 10 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        {
          error: `Upload rate limit reached (${rl.limit} uploads per 10 minutes). Please wait ${rl.resetSeconds} seconds before uploading more.`
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.resetSeconds) }
        }
      );
    }

    let fileBuffer: Buffer | null = null;
    let mimeType = 'image/jpeg';
    let ext = '.jpg';
    let baseName = 'upload';
    let source = 'file';

    const contentType = request.headers.get('content-type') || '';

    // Check if JSON body (e.g. { url: "https://drive.google.com/..." })
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const inputUrl = (body.url as string | undefined)?.trim();

      if (!inputUrl) {
        return NextResponse.json({ error: 'No image URL provided.' }, { status: 400 });
      }

      // If already stored in repository uploads, return as is
      if (inputUrl.includes('/uploads/')) {
        return NextResponse.json({
          success: true,
          url: inputUrl,
          message: 'Image is already hosted in repository.'
        });
      }

      source = 'url';
      const driveFileId = extractGoogleDriveFileId(inputUrl);

      if (driveFileId) {
        // Download from Google Drive
        const downloadResult = await downloadGoogleDriveFile(driveFileId);
        if (downloadResult.error || !downloadResult.buffer || downloadResult.buffer.length === 0) {
          return NextResponse.json({ error: downloadResult.error || 'Failed to download Google Drive image.' }, { status: 400 });
        }

        fileBuffer = downloadResult.buffer;
        baseName = `gdrive_${driveFileId.slice(0, 12)}`;
        mimeType = downloadResult.mimeType || 'image/jpeg';
      } else {
        // Download from external URL
        const downloadResult = await downloadExternalFile(inputUrl);
        if (downloadResult.error || !downloadResult.buffer || downloadResult.buffer.length === 0) {
          return NextResponse.json({ error: downloadResult.error || 'Failed to download image from URL.' }, { status: 400 });
        }

        fileBuffer = downloadResult.buffer;
        try {
          const parsed = new URL(inputUrl);
          const urlExt = path.extname(parsed.pathname).toLowerCase();
          const urlBase = path.basename(parsed.pathname, urlExt);
          if (urlBase) baseName = urlBase.slice(0, 30);
        } catch {
          baseName = 'downloaded_image';
        }
        mimeType = downloadResult.mimeType || 'image/jpeg';
      }

      // Detect real MIME type from buffer
      const detected = detectImageMime(fileBuffer);
      if (detected) {
        mimeType = detected.mime;
        ext = detected.ext;
      } else if (mimeType.includes('png')) {
        ext = '.png';
      } else if (mimeType.includes('webp')) {
        ext = '.webp';
      } else if (mimeType.includes('gif')) {
        ext = '.gif';
      } else if (mimeType.includes('svg')) {
        ext = '.svg';
      } else {
        ext = '.jpg';
      }
    } else {
      // Handle Multipart Form Data (file upload or form url)
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const formUrl = (formData.get('url') as string | null)?.trim();

      if (file && file.size > 0) {
        source = 'file';
        fileBuffer = Buffer.from(await file.arrayBuffer());
        mimeType = file.type;
        ext = path.extname(file.name).toLowerCase();
        baseName = path.basename(file.name, ext);

        // Fallback extension detection if missing
        if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
          const detected = detectImageMime(fileBuffer);
          if (detected) {
            ext = detected.ext;
            mimeType = detected.mime;
          }
        }
      } else if (formUrl) {
        // Form submitted a URL
        if (formUrl.includes('/uploads/')) {
          return NextResponse.json({
            success: true,
            url: formUrl,
            message: 'Image is already hosted in repository.'
          });
        }

        source = 'url';
        const driveFileId = extractGoogleDriveFileId(formUrl);

        if (driveFileId) {
          const downloadResult = await downloadGoogleDriveFile(driveFileId);
          if (downloadResult.error || !downloadResult.buffer || downloadResult.buffer.length === 0) {
            return NextResponse.json({ error: downloadResult.error || 'Failed to download Google Drive image.' }, { status: 400 });
          }
          fileBuffer = downloadResult.buffer;
          baseName = `gdrive_${driveFileId.slice(0, 12)}`;
          mimeType = downloadResult.mimeType || 'image/jpeg';
        } else {
          const downloadResult = await downloadExternalFile(formUrl);
          if (downloadResult.error || !downloadResult.buffer || downloadResult.buffer.length === 0) {
            return NextResponse.json({ error: downloadResult.error || 'Failed to download image from URL.' }, { status: 400 });
          }
          fileBuffer = downloadResult.buffer;
          mimeType = downloadResult.mimeType || 'image/jpeg';
        }

        const detected = detectImageMime(fileBuffer);
        if (detected) {
          mimeType = detected.mime;
          ext = detected.ext;
        }
      } else {
        return NextResponse.json({ error: 'No file or image URL provided.' }, { status: 400 });
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return NextResponse.json({ error: 'Empty file buffer received.' }, { status: 400 });
    }

    // 3. Strict file size validation
    if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 15MB.' },
        { status: 400 }
      );
    }

    // 4. Strict MIME type & Extension validation
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      const detected = detectImageMime(fileBuffer);
      if (detected && ALLOWED_MIME_TYPES.has(detected.mime)) {
        mimeType = detected.mime;
        ext = detected.ext;
      } else {
        return NextResponse.json(
          { error: `Invalid file format (${mimeType}). Allowed types: JPEG, PNG, WEBP, GIF, SVG.` },
          { status: 400 }
        );
      }
    }

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      ext = '.jpg';
    }

    // 5. Sanitize filename and prevent directory traversal
    const sanitizedBase = baseName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 40);
    const filename = `${Date.now()}_${sanitizedBase || 'upload'}${ext}`;
    const relativePath = `public/uploads/${filename}`;
    const relativeUrl = `/uploads/${filename}`;

    const base64Content = fileBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Content}`;

    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || 'racnavimumbai/RACNM_Website';
    const githubBranch = process.env.GITHUB_BRANCH || 'main';

    let githubCommitted = false;
    let finalUrl = relativeUrl;

    // 6. Direct GitHub Repository commit if GITHUB_TOKEN configured
    if (githubToken) {
      try {
        const ghUrl = `https://api.github.com/repos/${githubRepo}/contents/${relativePath}`;

        const ghRes = await fetch(ghUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'RACNM-Website-CMS'
          },
          body: JSON.stringify({
            message: `Upload image: ${filename} via Admin CMS [${source}]`,
            content: base64Content,
            branch: githubBranch
          })
        });

        if (ghRes.ok) {
          githubCommitted = true;
          finalUrl = `https://raw.githubusercontent.com/${githubRepo}/${githubBranch}/public/uploads/${filename}`;
          console.log(`[GitHub Upload] Successfully committed ${relativePath} to ${githubRepo}`);
        } else {
          const ghErr = await ghRes.json();
          console.error('[GitHub Upload Error]', ghErr);
        }
      } catch (err) {
        console.error('[GitHub Upload Exception]', err);
      }
    }

    // 7. Local filesystem write fallback for development
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, filename), fileBuffer);
    } catch (localErr) {
      console.warn('[Local Upload Warning]', localErr);
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      dataUrl,
      filename,
      githubCommitted,
      source
    });
  } catch (error: unknown) {
    console.error('[API /api/upload error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image.' },
      { status: 500 }
    );
  }
}
