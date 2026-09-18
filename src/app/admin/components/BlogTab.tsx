'use client';

import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Link as LinkIcon,
  Quote,
} from 'lucide-react';

interface BlogTabProps {
  blogPosts: any[];
  token: string | null;
  onRefresh: () => void;
  showNotification: (msg: string) => void;
}

const CATEGORIES = [
  'Homoeopathy Care',
  'Skin & Allergy',
  'Women\'s Health',
  'Pediatric Health',
  'Mental Wellness',
  'Lifestyle Tips',
  'YFE Therapy',
  'Patient Stories',
];

function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = useCallback(() => {
    const url = window.prompt('Enter link URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  return (
    <div className="border border-warm-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 bg-cream-50 border-b border-warm-200">
        {[
          { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
          { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
          { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
          { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
          { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
          { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
          { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
          { icon: LinkIcon, action: setLink, active: editor.isActive('link') },
        ].map((btn, i) => {
          const Icon = btn.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={btn.action}
              className={`p-2 rounded-lg transition-colors ${
                btn.active
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-espresso-500 hover:bg-warm-100'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[200px] text-xs [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror_p]:my-2 [&_.ProseMirror_h2]:font-serif [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-brand-300 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_a]:text-brand-600 [&_.ProseMirror_a]:underline"
      />
    </div>
  );
}

export default function BlogTab({
  blogPosts: initialPosts,
  token,
  onRefresh,
  showNotification,
}: BlogTabProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Homoeopathy Care',
    author: 'Dr. Megha Abhijit Bobde, MD, BHMS',
    readTime: '4 min read',
    coverImage: '',
    isPublished: true,
  });

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const resetForm = () => {
    setFormData({
      title: '', slug: '', excerpt: '', content: '',
      category: 'Homoeopathy Care',
      author: 'Dr. Megha Abhijit Bobde, MD, BHMS',
      readTime: '4 min read', coverImage: '', isPublished: true,
    });
  };

  const handleCreate = async () => {
    if (!token || !formData.title || !formData.excerpt) return;
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || generateSlug(formData.title),
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setPosts([created, ...posts]);
        resetForm();
        setShowCreateForm(false);
        showNotification(`Blog post "${created.title}" created!`);
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts(posts.map((p) => (p.id === id ? updated : p)));
        setEditingId(null);
        showNotification(`Blog post "${updated.title}" updated!`);
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!token || !confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
        showNotification(`Blog post "${title}" deleted.`);
      }
    } catch (err) { console.error(err); }
  };

  const togglePublish = async (id: string, currentlyPublished: boolean) => {
    if (!token) return;
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...post, isPublished: !currentlyPublished }),
      });
      if (res.ok) {
        setPosts(posts.map((p) => (p.id === id ? { ...p, isPublished: !currentlyPublished } : p)));
        showNotification(`Post ${!currentlyPublished ? 'published' : 'unpublished'}`);
      }
    } catch (err) { console.error(err); }
  };

  const startEditing = (post: any) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      readTime: post.readTime,
      coverImage: post.coverImage || '',
      isPublished: post.isPublished,
    });
    setEditingId(post.id);
    setShowCreateForm(false);
  };

  const PostForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">Post Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({
              ...formData,
              title: e.target.value,
              slug: formData.slug || generateSlug(e.target.value),
            })}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
          />
        </div>
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2.5 border border-warm-200 rounded-xl text-xs"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="font-semibold text-espresso-700 block mb-1">Excerpt / Summary *</label>
        <textarea
          rows={2}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full px-3.5 py-2 border border-warm-200 rounded-xl text-xs text-espresso-800"
          placeholder="Brief summary shown on the blog listing..."
        />
      </div>

      <div>
        <label className="font-semibold text-espresso-700 block mb-1">Full Article Content</label>
        <RichTextEditor
          content={formData.content}
          onChange={(html) => setFormData({ ...formData, content: html })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">Cover Image URL</label>
          <input
            type="text"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">Read Time</label>
          <input
            type="text"
            value={formData.readTime}
            onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs"
          />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-espresso-700">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600"
            />
            <span className="font-semibold">Publish immediately</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onSubmit}
          className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{submitLabel}</span>
        </button>
        <button
          onClick={() => { setEditingId(null); setShowCreateForm(false); }}
          className="px-4 py-2.5 rounded-full bg-warm-100 text-espresso-700 font-semibold text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-serif font-bold text-lg text-espresso-900">
            Health Blog & Articles
          </h3>
          <p className="text-xs text-espresso-500">
            Create, edit, publish, and manage blog posts with a rich text editor.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreateForm(true); setEditingId(null); }}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && !editingId && (
        <div className="p-5 bg-cream-50 border border-warm-200 rounded-2xl">
          <h4 className="font-bold text-espresso-900 text-sm mb-4">Create New Blog Post</h4>
          <PostForm onSubmit={handleCreate} submitLabel="Create Post" />
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id}>
            {editingId === post.id ? (
              <div className="p-5 bg-brand-50/50 border border-brand-200 rounded-2xl">
                <h4 className="font-bold text-espresso-900 text-sm mb-4">Editing: {post.title}</h4>
                <PostForm onSubmit={() => handleUpdate(post.id)} submitLabel="Save Changes" />
              </div>
            ) : (
              <div className="p-4 border border-warm-200 rounded-2xl bg-cream-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif font-bold text-espresso-900 text-sm">{post.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      post.isPublished
                        ? 'text-sage-800 bg-sage-100 border border-sage-200'
                        : 'text-amber-800 bg-amber-100 border border-amber-200'
                    }`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-espresso-500 text-[11px] mt-0.5">
                    {post.category} · {post.readTime}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => togglePublish(post.id, post.isPublished)}
                    className={`p-2 rounded-xl ${
                      post.isPublished
                        ? 'text-sage-600 hover:bg-sage-50'
                        : 'text-amber-600 hover:bg-amber-50'
                    }`}
                    title={post.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-espresso-400 hover:text-brand-600 hover:bg-brand-50"
                    title="View on site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => startEditing(post)}
                    className="p-2 rounded-xl text-espresso-400 hover:text-brand-600 hover:bg-brand-50"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-2 rounded-xl text-espresso-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {posts.length === 0 && (
          <p className="text-center text-espresso-400 text-xs py-8">
            No blog posts yet. Click "New Post" above to write your first article.
          </p>
        )}
      </div>
    </div>
  );
}