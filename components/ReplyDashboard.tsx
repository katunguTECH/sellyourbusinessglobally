// components/ReplyDashboard.tsx
import { useState, useEffect } from 'react';
import { Mail, MessageCircle, CheckCircle, XCircle, Clock, Reply, User, Building2 } from 'lucide-react';

export function ReplyDashboard() {
  const [replies, setReplies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReplies();
    // Poll every 30 seconds for new replies
    const interval = setInterval(fetchReplies, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/replies?filter=${filter}`);
      const data = await response.json();
      setReplies(data);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (replyId: string, message: string) => {
    try {
      await fetch('/api/replies/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyId, message }),
      });
      await fetchReplies();
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'interested':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'not_interested':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'question':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Reply className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inbox</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
          >
            <option value="all">All Replies</option>
            <option value="interested">Interested</option>
            <option value="not_interested">Not Interested</option>
            <option value="question">Questions</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {replies.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No replies yet</p>
            <p className="text-sm">Replies from your outreach will appear here</p>
          </div>
        ) : (
          replies.map((reply: any) => (
            <div
              key={reply.id}
              className={`p-4 bg-white/5 border rounded-lg transition-all ${
                reply.status === 'unread'
                  ? 'border-brand-500/50 bg-brand-500/5'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {reply.channel === 'email' ? (
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{reply.lead?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {reply.lead?.company}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-3">
                    {getCategoryIcon(reply.category)}
                    <span className="text-sm font-medium capitalize">
                      {reply.category || 'Neutral'}
                    </span>
                    {reply.status === 'unread' && (
                      <span className="px-2 py-0.5 text-xs bg-brand-500/20 text-brand-400 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-foreground/90 whitespace-pre-wrap">
                    {reply.message || reply.body}
                  </p>

                  {reply.sentiment && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Sentiment: {reply.sentiment}
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  {new Date(reply.received_at).toLocaleString()}
                </div>
              </div>

              {reply.category === 'interested' && !reply.auto_replied && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleReply(reply.id, "Great! I'll have our team reach out to schedule a call. ${process.env.NEXT_PUBLIC_BOOKING_LINK}")}
                    className="px-3 py-1 bg-brand-500 text-black rounded-lg text-sm hover:shadow-lg transition-all"
                  >
                    Send Booking Link
                  </button>
                  <button
                    onClick={() => handleReply(reply.id, "Thanks for your interest! Let me know when you'd be available for a quick discussion.")}
                    className="px-3 py-1 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-all"
                  >
                    Custom Reply
                  </button>
                </div>
              )}

              {reply.auto_replied && (
                <div className="mt-3 text-sm text-muted-foreground">
                  ✓ Auto-replied: {reply.auto_reply}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold">
            {replies.filter((r: any) => r.category === 'interested').length}
          </div>
          <div className="text-sm text-muted-foreground">Interested</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {replies.filter((r: any) => r.category === 'question').length}
          </div>
          <div className="text-sm text-muted-foreground">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {replies.filter((r: any) => r.status === 'unread').length}
          </div>
          <div className="text-sm text-muted-foreground">Unread</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {replies.length}
          </div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
      </div>
    </div>
  );
}