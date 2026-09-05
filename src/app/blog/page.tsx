import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BookOpen, Calendar, Clock, ArrowRight, User, Sparkles } from 'lucide-react';

export const metadata = {
  title: "Homoeopathy Health Blog & Educational Tips | Dr. Megha Bobde",
  description: "Educational articles on classical homoeopathy, managing seasonal allergies in Pune, holistic PCOS care, and pediatric immunity by Dr. Megha Bobde (MD, BHMS).",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-14 sm:py-20 text-espresso-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200/60 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Educational Resources
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 tracking-tight">
            Homoeopathy Health & Wellness Blog
          </h1>
          <p className="font-devanagari text-brand-700 text-sm font-medium">
            आरोग्यविषयक मार्गदर्शन व होमिओपॅथी माहिती संग्रह
          </p>
          <p className="text-sm sm:text-base text-espresso-600 leading-relaxed max-w-2xl mx-auto">
            Evidence-grounded insights and clinical wisdom from Dr. Megha Abhijit Bobde on building lasting biological immunity and healing through classical homoeopathy and flower remedies.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="boutique-card bg-white flex flex-col justify-between group hover:border-brand-300 transition-all duration-300"
            >
              <div className="p-7 space-y-3.5">
                <div className="flex items-center justify-between text-xs text-espresso-500">
                  <span className="font-semibold text-brand-800 bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 rounded-full text-[11px]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-espresso-400">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-espresso-950 group-hover:text-brand-700 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs sm:text-[13px] text-espresso-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="px-7 pb-6 pt-3 border-t border-tan-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-espresso-500 text-[11px]">
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span>{post.author}</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1 text-xs transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}