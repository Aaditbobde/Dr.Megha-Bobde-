import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Clock, Calendar, User, Heart, Share2, Sparkles, BookOpen } from 'lucide-react';
import BrandWatermark from '@/components/BrandWatermark';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | Dr. Megha Bobde's Homoeo Clinic`,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  const recentPosts = await prisma.blogPost.findMany({
    where: { id: { not: post.id }, isPublished: true },
    take: 3,
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12 sm:py-16 text-espresso-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Health Articles</span>
          </Link>
        </div>

        {/* Article Container Card */}
        <article className="boutique-card bg-white p-8 sm:p-12 relative overflow-hidden">
          <BrandWatermark className="opacity-[0.03] -right-20 -top-20 w-80 h-80" />

          {/* Article Header */}
          <header className="space-y-4 border-b border-tan-100 pb-8 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold text-brand-800 bg-brand-50 border border-brand-200/60 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-brand-600" />
              {post.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-bold text-espresso-950 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-espresso-500 pt-2">
              <span className="flex items-center gap-1.5 text-espresso-800 font-medium">
                <User className="w-4 h-4 text-brand-600" />
                {post.author}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-espresso-600">
                <Clock className="w-4 h-4 text-brand-500" />
                {post.readTime}
              </span>
              <span>·</span>
              <span className="text-espresso-500">Dr. Megha Bobde's Homoeo Clinic, Bavdhan</span>
            </div>
          </header>

          {/* Article Body */}
          <div className="py-8 prose prose-espresso max-w-none text-espresso-800 text-sm sm:text-base leading-relaxed space-y-6 relative z-10">
            <p className="text-base sm:text-lg font-serif font-medium text-brand-950 italic bg-brand-50/60 p-5 rounded-2xl border-l-4 border-brand-600 shadow-sm leading-relaxed">
              "{post.excerpt}"
            </p>

            <div className="whitespace-pre-line leading-relaxed space-y-4 text-espresso-800 font-sans">
              {post.content}
            </div>
          </div>

          {/* Author Bio Box */}
          <div className="mt-10 p-6 bg-[#FAF6F0] border border-tan-200 rounded-3xl flex flex-col sm:flex-row items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center text-white font-serif font-bold text-xl shadow-md shadow-brand-500/20 shrink-0">
              MB
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="font-serif font-bold text-espresso-950 text-base">
                  Dr. Megha Abhijit Bobde
                </h4>
                <span className="text-[10px] font-semibold text-brand-800 bg-brand-100/70 border border-brand-200 px-2 py-0.5 rounded-full">
                  MD (Mumbai), BHMS
                </span>
              </div>
              <p className="text-xs text-espresso-600 leading-relaxed">
                Consultant homoeopath with over 15 years of clinical experience in Bavdhan, Pune. Specialist in individualized constitutional remedy prescription, Yogananda Flower Essences, and lifestyle guidance.
              </p>
            </div>
          </div>
        </article>

        {/* More Articles */}
        {recentPosts.length > 0 && (
          <div className="mt-14 pt-8">
            <h3 className="font-serif font-bold text-2xl text-espresso-950 mb-6">
              More Health Tips & Clinical Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentPosts.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="boutique-card p-5 bg-white hover:border-brand-300 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-brand-700 uppercase block tracking-wider">
                      {r.category}
                    </span>
                    <h4 className="font-serif font-bold text-xs text-espresso-900 group-hover:text-brand-700 leading-snug">
                      {r.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-espresso-400 block mt-3 font-medium">{r.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}