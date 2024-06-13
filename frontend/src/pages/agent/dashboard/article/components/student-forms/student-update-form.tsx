import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '@/redux/store';
import { useState, useEffect } from 'react';
import { updateArticle } from '@/services/article/articleSlice';

interface ArticleUpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    _id: string;
    title: string;
    content: string;
    tags: string;
  } | undefined;
}

const ArticleUpdateForm: React.FC<ArticleUpdateFormProps> = ({ isOpen, onClose, article }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const author = user?._id;

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
    }
  }, [article]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!article || !article._id) return;
    try {
      await dispatch(updateArticle({ id: article._id, articleData: { title, content, author } })).unwrap();
      toast.success('Article updated successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
          <Heading title={'Update Article'} description={''} />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            <input
              type="text"
              className="px-4 py-6 shadow-inner drop-shadow-xl"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your title"
              required
            />
            <Textarea
              className="px-4 py-6 shadow-inner drop-shadow-xl"
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content"
              required
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full"
              size="lg"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full" size="lg">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleUpdateForm;
