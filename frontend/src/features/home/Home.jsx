import { Link, Navigate } from "react-router-dom";
import { FileText, Search, Tag, Shield, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const features = [
  {
    icon: FileText,
    title: "Rich markdown notes",
    description: "Write beautiful notes with full markdown support. Format, highlight, and style your content effortlessly.",
  },
  {
    icon: Search,
    title: "Instant search",
    description: "Find any note in seconds with powerful full-text search across all your content.",
  },
  {
    icon: Tag,
    title: "Organize with tags",
    description: "Keep your notes tidy with custom tags. Filter and browse by topic in one click.",
  },
  {
    icon: Shield,
    title: "Private & secure",
    description: "Your notes are protected with JWT authentication. Only you can access your content.",
  },
  {
    icon: Zap,
    title: "Fast & lightweight",
    description: "Built for speed with a clean, minimal interface that stays out of your way.",
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="5" fill="#5c5fef" />
              <path d="M7 7h4l3 5-3 5H7l3-5-3-5z" fill="#fff" fillOpacity="0.9" />
              <path d="M13 7h4v2h-4V7zm0 4h4v2h-4v-2zm0 4h4v2h-4v-2z" fill="#fff" fillOpacity="0.6" />
            </svg>
            <span className="text-text font-bold text-base tracking-tight">Inkwell</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link to="/signup" className="btn-primary text-sm !rounded-lg">Get started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light border border-accent-subtle text-accent-hover text-xs font-medium mb-8">
            <Zap size={13} />
            Your ideas, beautifully organized
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text tracking-tight leading-tight">
            Capture your thoughts,
            <br />
            <span className="text-accent">keep them forever</span>
          </h1>
          <p className="mt-6 text-text-secondary text-lg max-w-xl mx-auto">
            A clean, fast note-taking app built for focus. Write in markdown, organize with tags, and find anything instantly.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link to="/signup" className="btn-primary !px-6 !py-3 !text-base !rounded-lg">
              Start writing free
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary !px-6 !py-3 !text-base !rounded-lg">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-text text-center tracking-tight mb-3">
            Everything you need
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-lg mx-auto">
            Simple tools that get out of your way and let you focus on what matters.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-surface border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent-subtle flex items-center justify-center mb-4">
                  <Icon size={18} className="text-accent" />
                </div>
                <h3 className="text-text font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center bg-surface border border-border rounded-2xl p-10 sm:p-14 shadow-card">
          <h2 className="text-2xl font-bold text-text tracking-tight mb-3">
            Ready to start writing?
          </h2>
          <p className="text-text-secondary mb-8">
            No credit card required. Just sign up and start capturing your ideas.
          </p>
          <Link to="/signup" className="btn-primary !px-6 !py-3 !text-base !rounded-lg">
            Create your free account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-text-tertiary text-xs">
          <p>Inkwell &mdash; Your private space for ideas.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
