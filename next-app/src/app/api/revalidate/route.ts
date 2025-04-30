import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Secret key to secure the revalidation endpoint
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'your-default-secret-key';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path') || '/';
  const tag = request.nextUrl.searchParams.get('tag');
  
  // Check the secret
  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: 'Invalid revalidation secret' },
      { status: 401 }
    );
  }
  
  try {
    // If a tag is provided, revalidate by tag
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({
        revalidated: true,
        message: `Tag "${tag}" revalidated successfully`,
      });
    }
    
    // Otherwise revalidate by path
    revalidatePath(path);
    return NextResponse.json({
      revalidated: true,
      message: `Path "${path}" revalidated successfully`,
    });
  } catch (err) {
    console.error('Error during revalidation:', err);
    return NextResponse.json(
      { revalidated: false, message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
} 