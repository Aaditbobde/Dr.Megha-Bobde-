import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const all = searchParams.get('all');

    let whereClause: any = { isPublished: true };

    if (all === 'true') {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      if (token && verifyAdminToken(token)) {
        whereClause = {};
      }
    }

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category || 'Homoeopathy Care',
        author: body.author || 'Dr. Megha Bobde, BHMS',
        readTime: body.readTime || '4 min read',
        coverImage: body.coverImage || null,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}