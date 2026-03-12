import { useState, useEffect } from 'react'
import { getPosts, createPost, likePost, getComments, addComment } from '../../api/community'
import { Heart, MessageCircle, Send, Plus, X, Image } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Community() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [expandedComments, setExpandedComments] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    try {
      const { data } = await getPosts()
      setPosts(Array.isArray(data) ? data : data.results || [])
    } catch { toast.error('Failed to load feed') }
    finally { setLoading(false) }
  }

  const handleLike = async (postId) => {
    try {
      await likePost(postId)
      setPosts((prev) => prev.map((p) =>
        p.id === postId ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? (p.likes_count || 1) - 1 : (p.likes_count || 0) + 1 } : p
      ))
    } catch { toast.error('Failed to like') }
  }

  const loadComments = async (postId) => {
    if (expandedComments === postId) { setExpandedComments(null); return }
    try {
      const { data } = await getComments(postId)
      setComments(Array.isArray(data) ? data : data.results || [])
      setExpandedComments(postId)
    } catch { toast.error('Failed to load comments') }
  }

  const handleComment = async (postId) => {
    if (!newComment.trim()) return
    try {
      await addComment(postId, { content: newComment })
      setNewComment('')
      loadComments(postId)
      toast.success('Comment added!')
    } catch { toast.error('Failed to add comment') }
  }

  if (loading) return <LoadingSpinner text="Loading feed…" />

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-sage-dark px-5 pt-12 pb-6">
        <h1 className="font-display text-2xl font-bold text-white">Community</h1>
        <p className="text-sage-light text-sm mt-1">Share and connect with pet parents</p>
      </div>

      <div className="px-5 py-4 space-y-4 pb-24">
        {posts.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3">💬</span>
            <p className="text-gray-500 font-medium">No posts yet</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to share something!</p>
          </div>
        )}

        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Post Header */}
            <div className="px-4 pt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sage-dark/10 flex items-center justify-center text-sm font-bold text-sage-dark">
                {(post.author_name || post.username || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{post.author_name || post.username}</p>
                <p className="text-[10px] text-gray-400">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</p>
              </div>
            </div>

            {/* Content */}
            <p className="px-4 py-3 text-sm text-gray-700">{post.content}</p>

            {/* Image */}
            {post.image && (
              <img src={post.image} alt="" className="w-full h-48 object-cover" />
            )}

            {/* Actions */}
            <div className="px-4 py-3 flex items-center gap-5 border-t border-gray-50">
              <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-xs font-medium">
                <Heart size={16} className={post.is_liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                <span className={post.is_liked ? 'text-red-500' : 'text-gray-400'}>{post.likes_count || 0}</span>
              </button>
              <button onClick={() => loadComments(post.id)} className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <MessageCircle size={16} /> {post.comments_count || 0}
              </button>
            </div>

            {/* Comments */}
            {expandedComments === post.id && (
              <div className="border-t border-gray-50 px-4 py-3">
                {comments.length === 0 && <p className="text-xs text-gray-400 mb-2">No comments yet</p>}
                {comments.map((c, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-xs"><strong className="text-gray-900">{c.author_name || c.username}</strong> <span className="text-gray-500">{c.content}</span></p>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment…"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)} />
                  <button onClick={() => handleComment(post.id)}
                    className="w-8 h-8 rounded-full bg-sage-dark text-white flex items-center justify-center flex-shrink-0">
                    <Send size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Post FAB */}
      <button onClick={() => setShowCreate(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-sage-dark text-white rounded-full shadow-lg shadow-sage-dark/30 flex items-center justify-center active:scale-90 transition-transform z-40">
        <Plus size={24} />
      </button>

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); loadPosts() }} />}
    </div>
  )
}

function CreatePostModal({ onClose, onCreated }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) { toast.error('Write something!'); return }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('content', content)
      if (image) formData.append('image', image)
      await createPost(formData)
      toast.success('Post created! 🎉')
      onCreated()
    } catch { toast.error('Failed to create post') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Create Post</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? 🐾" rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none resize-none" />
          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <Image size={16} />
            <span>{image ? image.name : 'Add photo'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
          </label>
          <button type="submit" disabled={loading}
            className="w-full bg-sage-dark text-white py-3 rounded-xl font-semibold active:scale-[0.98] disabled:opacity-60">
            {loading ? 'Posting…' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  )
}
