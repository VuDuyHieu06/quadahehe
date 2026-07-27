import { useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea, Label } from '../ui/Input';
import { reviewApi } from '../../api';
import { useToast } from '../ui/Toast';

export function ReviewModal({ hotelId, open, onClose, onDone }: { hotelId: number; open: boolean; onClose: () => void; onDone: () => void; }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reviewApi.create(hotelId, { rating, comment: comment || undefined });
      toast.push('Cảm ơn đánh giá của bạn!', 'success');
      setComment('');
      onDone();
      onClose();
    } catch (err) {
      toast.push(err instanceof Error ? err.message : 'Gửi đánh giá thất bại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Viết đánh giá">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Điểm (1-5)</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)} className={`h-10 w-10 rounded-lg text-lg ${n <= rating ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-400'}`}>★</button>
            ))}
          </div>
        </div>
        <div>
          <Label>Bình luận</Label>
          <Textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn..." />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi đánh giá'}</Button>
      </form>
    </Modal>
  );
}
