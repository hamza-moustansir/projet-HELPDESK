import FileUpload from '@/components/shared/fileupload';
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';
import { createArticle } from '@/services/article/articleSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { useState } from 'react';

const ArticleCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const dispatch: Dispatch<unknown> = useDispatch();
  const navigate = useNavigate();
  const author= user?._id;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createArticle({ title, content, author }))
      .unwrap()
      .then(() => {
        navigate('/agent-article');
        toast.success('New Article created!');
        modalClose();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="px-2">
      <div className="flex items-center justify-center text-2xl font-bold">
        {'<Logo/>'}
      </div>

      <Heading
        title={'Create New Article'}
        description={''}
        className="space-y-2 py-4 text-center"
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <input
            type="text"
            className=" px-4 py-6 shadow-inner drop-shadow-xl"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title"
            required
          />
          <Textarea
            className=" px-4 py-6 shadow-inner drop-shadow-xl"
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
            onClick={modalClose}
          >
            Cancel
          </Button>
          <Button type="submit" className="rounded-full" size="lg">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArticleCreateForm;
