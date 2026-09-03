import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const filename = `${Date.now()}_${sanitizeName}`;
    const relativePath = `public/uploads/${filename}`;
    const relativeUrl = `/uploads/${filename}`;

    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || 'racnavimumbai/RACNM_Website';
    const githubBranch = process.env.GITHUB_BRANCH || 'main';

    let githubCommitted = false;
    let finalUrl = relativeUrl;

    const base64Content = buffer.toString('base64');
    const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64Content}`;

    // 1. If GITHUB_TOKEN is configured, commit file directly to GitHub repository via REST API
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
          // Construct direct raw GitHub URL for instant global CDN accessibility
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

    // 2. Local filesystem write fallback for development
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
