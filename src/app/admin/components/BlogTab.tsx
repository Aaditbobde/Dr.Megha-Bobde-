'use client';

import React from 'react';
import { FileText, Clock, User } from 'lucide-react';

interface BlogTabProps {
  blogPosts: any[];
}

export default function BlogTab({ blogPosts }: BlogTabProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="font-serif font-bold text-lg text-slate-900">
          Homoeopathy Articles & Patient Health Tips
        </h3>
        <p className="text-xs text-slate-500">
          Articles published on the public educational blog.
        </p>
      </div>

      <div className="space-y-3">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="p-5 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs bg-slate-50/50"
          >
            <div>
              <h4 className="font-serif font-bold text-slate-900 text-sm">{post.title}</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                {post.category} · {post.readTime} · Author: {post.author}
              </p>
            </div>
            <span className="text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shrink-0">
              Published Live
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}