import { deleteArticle } from '../../../../../../services/article/articleSlice';
import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from '@/routes/hooks';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { toast } from 'react-toastify';
import ArticleUpdateForm from '../student-forms/student-update-form'; 

interface CellActionProps {
  article: {
    _id: string;
    title: string;
    content: string;
    tags: string;
  } | undefined;
}

export const CellAction: React.FC<CellActionProps> = ({ article }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const onConfirm = async () => {
    if (!article || !article._id) {
      console.error('Article ID is missing.');
      return;
    }

    setLoading(true);
    try {
      await dispatch(deleteArticle(article._id)).unwrap();
      setOpen(false);
      toast.success('Delete successful');
    } catch (error) {
      console.error('Failed to delete article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = () => {
    if (article && article._id) {
      router.push(`/agent-article/article/${article._id}`);
    }
  };

  const handleEditClick = () => {
    setUpdateModalOpen(true);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <ArticleUpdateForm
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        article={article}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleViewClick}>
            <Eye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
