import FileUpload from '@/components/shared/fileupload';
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"
import { updateTicketDescription } from '../../../../../../services/tickets/ticketSlice'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { unwrapResult } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
}

const StudentEditForm = ({ modalClose }: { modalClose: () => void }) => {
  const { ticketId } = useParams<{ ticketId: string }>(); // Utiliser useParams pour récupérer l'identifiant du ticket depuis l'URL
  const { user } = useSelector<RootState, { auth: { user: User } }>((state) => state.auth);
  const [name] = useState(user.name);
  const [email] = useState(user.email);
  const [service, setService] = useState<string>('');
  const [titre, setTitre] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Utiliser l'identifiant du ticket récupéré depuis useParams
    dispatch(updateTicketDescription({ ticketId, description: description }))
      .unwrap()
      .then(() => {
        navigate('/employe-ticket');
        toast.success('Ticket updated!');
        modalClose()
      })
      .catch((error: Error) => toast.error(error.message));
  };
  

  return (
    <div className="px-2">
      <div className="flex items-center justify-center text-2xl font-bold">
        {'<Logo/>'}
      </div>

      <Heading
        title={'Edit New Ticket'}
        description={
          ""
        }
        className="space-y-2 py-4 text-center"
      />
      
        <form onSubmit={onSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <input
              type='text'
              className=" px-4 py-6 shadow-inner drop-shadow-xl"
              id='titre'
              name='titre'
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder='Enter your titre'
              required
            />    
            <input
              type='description'
              className=" px-4 py-6 shadow-inner drop-shadow-xl"
              id='description'
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter your description'
              required
            />    
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <label htmlFor='service'>Choisir le service</label>
            <select
              name='service'
              id='service'
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value='hardware'>hardware</option>
              <option value='software'>software</option>
              <option value='reseau'>reseau</option>
            </select>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full "
              size="lg"
              onClick={modalClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full" size="lg">
              Edit
            </Button>
          </div>
        </form>
      
    </div>
  );
};

export default StudentEditForm;
