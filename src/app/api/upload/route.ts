import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminSession } from '@/lib/auth/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 Megabytes for DSLR and iPhone photos
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

    // 2. Upload Rate Limiting (Allows up to 25 photo uploads per 10 minutes)
    const clientIp = getClientIp(request);
    const rl = rateLimit(`upload_${clientIp}`, 25, 10 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        {
          error: `Upload rate limit reached (${rl.limit} photos per 10 minutes). Please wait ${rl.resetSeconds} seconds before uploading more.`
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.resetSeconds) }
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // 3. Strict file size validation prior to buffer allocation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 15MB.' },
        { status: 400 }
      );
    }

    // 3. Strict MIME type validation
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Allowed types: JPEG, PNG, WEBP, GIF, SVG.' },
        { status: 400 }
      );
    }

    // 4. Strict extension validation
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'Invalid file extension. Only standard image extensions are allowed.' },
        { status: 400 }
      );
    }

    // 5. Sanitize filename and prevent directory traversal
    const baseName = path.basename(file.name, ext);
    const sanitizedBase = baseName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 50);
    const filename = `${Date.now()}_${sanitizedBase || 'upload'}${ext}`;
    const relativePath = `public/uploads/${filename}`;
    const relativeUrl = `/uploads/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Content}`;

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
            message: `Upload image: ${filename} via Admin CMS`,
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
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
    } catch (localErr) {
      console.warn('[Local Upload Warning]', localErr);
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      dataUrl,
      filename,
      githubCommitted
    });
  } catch (error: unknown) {
    console.error('[API /api/upload error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image.' },
      { status: 500 }
    );
  }
}
