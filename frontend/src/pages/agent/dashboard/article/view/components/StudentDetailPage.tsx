import Heading from '@/components/shared/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from '@/routes/hooks';
import { ChevronLeftIcon } from 'lucide-react';
import { getArticle } from '../../../../../../services/article/articleSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RootState } from '@/redux/store';

export default function TicketDetailPage() {
  const [isLoading, setIsLoading] = useState(true);

  const { article } = useSelector((state: RootState) => state.article);
  const dispatch = useDispatch();
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    dispatch(getArticle(articleId))
      .unwrap()
      .then(() => setIsLoading(false))
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  }, [articleId, dispatch]);

  if (isLoading) {
    return <h1>Loading!!!</h1>;
  }

  const createdAtDate = new Date(article.createdAt).toLocaleDateString();
  const updatedAtDate = new Date(article.updatedAt).toLocaleDateString();

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <Heading title={'Article Details'} />
        <div className="flex justify-end gap-3">
          <Button onClick={() => router.back()}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-4">
        <div className="col-span-1 flex flex-col gap-6 lg:col-span-1">
          <Card className="bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between font-bold">
              <p className="text-xl text-center ">L'Article</p>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
            <div className='flex flex-col'>
              
              <p className=" font-semibold">DATE CREATION:</p>
              <p className="text-xl ml-12">{createdAtDate}</p>
              
              <p className=" font-semibold">LAST UPDATE:</p>
              <p className="text-xl ml-12">{updatedAtDate}</p></div>
            </CardContent>
          </Card>
        </div>
        {/* contact information */}
        <Card className="col-span-1 bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm lg:col-span-3">
          <CardHeader className="text-xl font-bold">
            <p className="text-xl text-center">{article.title}</p>
          </CardHeader>
          <CardContent>
            <p>{article.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
