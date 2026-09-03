import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'No imageUrl provided.' }, { status: 400 });
    }

    // Extract filename from URL or path
    let filename = '';
    if (imageUrl.includes('/uploads/')) {
      filename = imageUrl.split('/uploads/').pop()?.split('?')[0] || '';
    }

    if (!filename || filename.includes('..') || filename.includes('/')) {
      // Not a repository uploaded file or external image (e.g. Unsplash) — safe ignore
      return NextResponse.json({ success: true, message: 'External image skipped.' });
    }

    const relativePath = `public/uploads/${filename}`;
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || 'racnavimumbai/RACNM_Website';
    const githubBranch = process.env.GITHUB_BRANCH || 'main';

    let githubDeleted = false;

    // 1. Delete from GitHub repository via REST API if GITHUB_TOKEN is present
    if (githubToken) {
      try {
        const getUrl = `https://api.github.com/repos/${githubRepo}/contents/${relativePath}?ref=${githubBranch}`;
        const getRes = await fetch(getUrl, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'RACNM-Website-CMS'
          }
        });

        if (getRes.ok) {
          const fileData = await getRes.json();
          const sha = fileData.sha;

          if (sha) {
            const delRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${relativePath}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'RACNM-Website-CMS'
              },
              body: JSON.stringify({
                message: `Delete unused image: ${filename} via Admin CMS`,
                sha,
                branch: githubBranch
              })
            });

            if (delRes.ok) {
              githubDeleted = true;
              console.log(`[GitHub Delete] Successfully deleted ${relativePath} from ${githubRepo}`);
            } else {
              const delErr = await delRes.json();
              console.error('[GitHub Delete Error]', delErr);
            }
          }
        }
      } catch (ghErr) {
        console.error('[GitHub Delete Exception]', ghErr);
      }
    }

    // 2. Local filesystem unlink fallback for development
    try {
      const localPath = path.join(process.cwd(), 'public', 'uploads', filename);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    } catch (localErr) {
      console.warn('[Local Unlink Warning]', localErr);
    }

    return NextResponse.json({
      success: true,
      filename,
      githubDeleted
    });
  } catch (error: unknown) {
    console.error('[API /api/delete-image error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete image.' },
      { status: 500 }
    );
  }
}
