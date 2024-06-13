import Heading from '@/components/shared/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from '@/routes/hooks';
import { ChevronLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTicket, closeTicket } from '../../../../../services/tickets/ticketSlice';
import { RootState } from '@/redux/store';
import ChatComponent from './ChatComponent'; // Assurez-vous de l'importer correctement

export default function TicketDetailPage() {
  const [isLoading, setIsLoading] = useState(true);

  const { ticket } = useSelector((state: RootState) => state.tickets);
  const dispatch = useDispatch();
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    dispatch(getTicket(ticketId))
      .unwrap()
      .then(() => setIsLoading(false))
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  }, [ticketId, dispatch]);

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId))
      .unwrap()
      .then(() => {
        toast.success('Ticket Closed');
        navigate(`/employe-ticket/ticket/${ticket._id}`);
      })
      .catch(toast.error);
  };

  if (isLoading) {
    return <h1>Loading!!!</h1>;
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <Heading title={'Ticket Details'} />
        <div className="flex justify-end gap-3">
          <Button onClick={() => router.back()}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      <div className="grid  grid-cols-1 gap-6 py-6 lg:grid-cols-4">
        <div className=" col-span-1 flex flex-col gap-6 lg:col-span-1">
          <Card className="bg-secondary  shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between font-bold">
              <p className="text-xl"> {ticket.titre}</p>
  <Badge className={`${
    ticket.status === 'new' ? 'bg-green-600' : 
    ticket.status === 'closed' ? 'bg-red-600' : 
    'bg-gray-600'
  }`}>
    {ticket.status}
  </Badge>

            </CardHeader>
            <CardContent className="flex items-center">
              <p>{ticket.description}</p>
            </CardContent>
          </Card>
        </div>
        <Card className=" col-span-1 bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm lg:col-span-3">
          <CardHeader className="text-xl font-bold">
            Chat
          </CardHeader>
          <CardContent>
          {ticket.status !== 'closed' && (
            <ChatComponent ticketId={ticketId} /> )}
            {ticket.status !== 'new' && (
              <p className="text-xl font-bold flex items-center justify-center" >pas de chat!!!</p>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
