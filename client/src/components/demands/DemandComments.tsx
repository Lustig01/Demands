import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdSend, MdDelete } from 'react-icons/md';
import type { DemandComment } from '../../types/domain';
import {
  fetchDemandComments,
  createDemandComment,
  deleteDemandComment,
} from '../../api/apiService';

interface DemandCommentsProps {
  demandId: number;
  currentUser: string;
  isPrivileged: boolean;
}

export default function DemandComments({
  demandId,
  currentUser,
  isPrivileged,
}: DemandCommentsProps) {
  const { t, i18n } = useTranslation();
  const [comments, setComments] = useState<DemandComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [demandId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const data = await fetchDemandComments(demandId);
      setComments(data);
      setError(null);
    } catch {
      setError(t('comments.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const comment = await createDemandComment(demandId, newComment.trim());
      setComments([...comments, comment]);
      setNewComment('');
      setError(null);
    } catch {
      setError(t('comments.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteDemandComment(demandId, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      setError(t('comments.deleteError'));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(i18n.language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const canDeleteComment = (comment: DemandComment) => {
    return isPrivileged || comment.createdBy === currentUser;
  };

  if (isLoading) {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          {t('comments.title')}
        </h3>
        <div className="text-text-secondary text-sm">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-text-primary mb-3">
        {t('comments.title')}
      </h3>

      {error && <div className="text-danger text-sm mb-3">{error}</div>}

      {/* Comments list */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-text-secondary text-sm">{t('comments.noComments')}</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 rounded-lg p-3 relative group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-medium text-text-primary">
                    {comment.createdByName}
                  </span>
                  <span className="text-xs text-text-secondary ms-2">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                {canDeleteComment(comment) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-secondary hover:text-danger transition-all bg-transparent border-none cursor-pointer"
                    title={t('common.delete')}
                  >
                    <MdDelete size={16} />
                  </button>
                )}
              </div>
              <p className="text-sm text-text-primary mt-1 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t('comments.placeholder')}
          className="flex-1 px-3 py-2 border border-divider rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          rows={2}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 self-end"
        >
          <MdSend size={16} />
          {t('comments.send')}
        </button>
      </form>
    </div>
  );
}
