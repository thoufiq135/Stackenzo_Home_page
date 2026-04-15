import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Users,
  Search,
  Plus,
  Bot,
  Send,
  X,
  Clock,
  Heart,
  MessageSquare,
  Eye,
  ChevronRight,
  Award,
  Code,
  BookOpen,
  Filter,
  Hash,
  Share2,
  Bookmark
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

function NewCommunity() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showNewPost, setShowNewPost] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  const categories = [
    "All",
    "Web Development",
    "AI & ML",
    "Mobile Dev",
    "Data Science",
    "DevOps",
    "Career",
    "Projects"
  ];

  const [posts, setPosts] = useState([
    {
      id: 1,
      type: "question",
      title: "How to optimize React performance?",
      content: "I'm working on a React app with many components and facing performance issues. What are the best practices?",
      category: "Web Development",
      tags: ["React", "Performance", "Optimization"],
      author: {
        name: "Sarah Chen",
        type: "Student",
        avatar: "👩🎓",
        reputation: 150
      },
      stats: { likes: 5, comments: 2, views: 45, shares: 1 },
      comments: [
        {
          id: 101,
          content: "Use React.memo for component optimization and avoid unnecessary re-renders.",
          author: { name: "Dr. Kumar", type: "Guide" },
          likes: 3
        },
        {
          id: 102,
          content: "Also consider using useMemo and useCallback hooks for expensive calculations.",
          author: { name: "Prof. Smith", type: "Guide" },
          likes: 2
        }
      ],
      timeAgo: "2 hours ago",
      isAnswered: true
    },
    {
      id: 2,
      type: "question",
      title: "Best practices for API integration in Node.js?",
      content: "I need to integrate multiple APIs in my Node.js backend. What's the best approach for error handling and data validation?",
      category: "Web Development",
      tags: ["Node.js", "API", "Backend"],
      author: {
        name: "Alex Kumar",
        type: "Student",
        avatar: "👨🎓",
        reputation: 89
      },
      stats: { likes: 3, comments: 0, views: 23, shares: 0 },
      comments: [],
      timeAgo: "1 hour ago",
      isAnswered: false
    }
  ]);

  // 🔹 Login
  const handleLogin = (type) => {
    setUserType(type);
    setIsLoggedIn(true);
    toast.success(`Welcome ${type}!`);
  };

  // 🔹 Create Post
  const handleCreatePost = (title, content, category, tags) => {
    const newPost = {
      id: Date.now(),
      type: "question",
      title,
      content,
      category,
      tags: tags.split(",").map((t) => t.trim()),
      author: {
        name: "You",
        type: userType,
        avatar: userType === "Student" ? "👨‍🎓" : "👨‍🏫",
        reputation: 0
      },
      stats: { likes: 0, comments: 0, views: 0, shares: 0 },
      comments: [],
      timeAgo: "Just now",
      isAnswered: false
    };

    setPosts((prev) => [newPost, ...prev]);
    setShowNewPost(false);
    toast.success("Post created!");
  };

  // 🔹 Like Post
  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, stats: { ...post.stats, likes: post.stats.likes + 1 } }
          : post
      )
    );
  };

  // 🔹 Add Comment (Guide Only)
  const handleAddComment = (postId) => {
    if (!commentInputs[postId]?.trim()) return;

    const newComment = {
      id: Date.now(),
      content: commentInputs[postId],
      author: {
        name: "You",
        type: userType
      },
      likes: 0
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
              stats: {
                ...post.stats,
                comments: post.stats.comments + 1
              },
              isAnswered: true
            }
          : post
      )
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  // 🔹 Like Comment
  const handleCommentLike = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, likes: comment.likes + 1 }
                  : comment
              )
            }
          : post
      )
    );
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 🔹 Login Page
  if (!isLoggedIn) {
    return (
      <div className="bg-gray-950 text-white min-h-screen flex items-center justify-center">
        <Toaster />
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 w-80 text-center">
          <h1 className="text-2xl font-bold mb-6">Join Community</h1>
          <button
            onClick={() => handleLogin("Student")}
            className="w-full mb-4 py-3 bg-blue-600 rounded-lg"
          >
            Student
          </button>
          <button
            onClick={() => handleLogin("Guide")}
            className="w-full py-3 bg-olive green-400 text-black rounded-lg"
          >
            Guide
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />
      <Toaster />

      {/* HERO */}
      <section className="pt-24 pb-12 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
          Stackenzo Community Hub
        </h1>
        <p className="text-gray-400">
          Connect, Ask, Answer & Grow Together 🚀
        </p>
      </section>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-olive green-400 font-semibold mb-4 flex gap-2">
              <Filter size={18} /> Categories
            </h3>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`block w-full text-left px-3 py-2 rounded-lg mb-2 ${
                  selectedCategory === cat
                    ? "bg-olive green-400 text-black"
                    : "hover:bg-gray-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="lg:col-span-3">
          {/* Search + Ask */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {userType === "Student" && (
              <button
                onClick={() => setShowNewPost(true)}
                className="px-6 py-3 bg-blue-600 rounded-lg"
              >
                Ask Question
              </button>
            )}
          </div>

          {/* POSTS */}
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-6"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                {post.isAnswered && (
                  <span className="text-olive green-400 text-xs">Answered</span>
                )}
              </div>

              <p className="text-gray-400 mb-4">{post.content}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-6 mb-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 hover:text-red-400"
                >
                  <Heart size={18} />
                  {post.stats.likes}
                </button>

                <div className="flex items-center gap-2">
                  <MessageSquare size={18} />
                  {post.stats.comments}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-800 p-3 rounded-lg flex justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {comment.author.name}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {comment.content}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleCommentLike(post.id, comment.id)
                      }
                      className="flex items-center gap-1 hover:text-red-400"
                    >
                      <Heart size={14} />
                      {comment.likes}
                    </button>
                  </div>
                ))}
              </div>

              {/* Guide Answer Box */}
              {userType === "Guide" && post.type === "question" && (
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))
                    }
                    placeholder="Write your answer..."
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2 bg-olive green-400 text-black rounded-lg"
                  >
                    Answer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* NEW POST MODAL */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-xl w-full max-w-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">
                Ask a Question
              </h2>

              <input
                id="title"
                placeholder="Title"
                className="w-full mb-3 px-4 py-3 bg-gray-800 rounded-lg"
              />
              <textarea
                id="content"
                placeholder="Details..."
                className="w-full mb-3 px-4 py-3 bg-gray-800 rounded-lg"
              />
              <input
                id="tags"
                placeholder="Tags (comma separated)"
                className="w-full mb-3 px-4 py-3 bg-gray-800 rounded-lg"
              />

              <button
                onClick={() =>
                  handleCreatePost(
                    document.getElementById("title").value,
                    document.getElementById("content").value,
                    "Web Development",
                    document.getElementById("tags").value
                  )
                }
                className="w-full py-3 bg-blue-600 rounded-lg"
              >
                Post Question
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default NewCommunity;
